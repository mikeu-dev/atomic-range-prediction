<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    import {
        selectedBomb,
        currentBlastData,
        addBlastToHistory,
        comparisonMode,
        comparisonBombs,
        useRealTimeWeather,
    } from "$lib/stores/appStore";
    import {
        calculateBlastRadius,
        estimatePopulationAffected,
        calculateDetailedMetrics,
        generateId,
    } from "$lib/utils/blastCalculator";
    import {
        generateRandomWind,
        calculateFalloutPattern,
        generateFalloutPolygon,
    } from "$lib/utils/windEffects";
    import { fetchRealTimeWeather } from "$lib/utils/weatherService";
    import {
        BLAST_ZONE_COLORS,
        BLAST_ZONE_OPACITY,
        FALLOUT_COLORS,
        FALLOUT_OPACITY,
        ANIMATION,
    } from "$lib/utils/constants";
    import type { BlastEvent } from "$lib/types";
    import {
        isValidCoordinates,
        validateCountryName,
        ValidationError,
    } from "$lib/utils/validation";

    export let mapId = "chartdiv";

    let root: any;
    let chart: any;
    let polygonSeries: any;

    // Series untuk setiap zona blast
    let fireballSeries: any;
    let radiationSeries: any;
    let heavyBlastSeries: any;
    let moderateBlastSeries: any;
    let lightBlastSeries: any;
    let thermalSeries: any;
    let falloutSeries: any;
    let windSeries: any;

    let isLoading = true;
    let isCalculating = false;

    let am5Core: any = null; // Store am5 reference for use in exported functions

    onMount(async () => {
        if (!browser) return;

        // Dynamic import untuk avoid SSR issues
        const am5 = await import("@amcharts/amcharts5");
        am5Core = am5; // Store for use in exported functions
        const am5map = await import("@amcharts/amcharts5/map");
        const { default: am5geodata_worldLow } = await import(
            "@amcharts/amcharts5-geodata/worldLow"
        );
        const { default: am5themes_Animated } = await import(
            "@amcharts/amcharts5/themes/Animated"
        );
        // Create root element
        root = am5.Root.new(mapId);
        root.setThemes([am5themes_Animated.new(root)]);

        // Create map chart
        chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "rotateX",
                panY: "translateY",
                projection: am5map.geoMercator(),
                homeGeoPoint: { latitude: 2, longitude: 2 },
            }),
        );

        // Add map/globe toggle
        const cont = chart.children.push(
            am5.Container.new(root, {
                layout: root.horizontalLayout,
                x: 20,
                y: 40,
            }),
        );

        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Peta",
            }),
        );

        const switchButton = cont.children.push(
            am5.Button.new(root, {
                themeTags: ["switch"],
                centerY: am5.p50,
                icon: am5.Circle.new(root, {
                    themeTags: ["icon"],
                }),
            }),
        );

        const backgroundSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {}),
        );
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0,
            strokeOpacity: 0,
        });

        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180),
        });

        switchButton.on("active", function () {
            if (!switchButton.get("active")) {
                chart.set("projection", am5map.geoMercator());
                chart.set("panY", "translateY");
                chart.set("rotationY", 0);
                backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
            } else {
                chart.set("projection", am5map.geoOrthographic());
                chart.set("panY", "rotateY");
                backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
            }
        });

        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Globe",
            }),
        );

        // Add projection buttons
        const buttons = chart.children.push(
            am5.Container.new(root, {
                x: am5.p50,
                centerX: am5.p50,
                y: am5.p100,
                dy: -10,
                centerY: am5.p100,
                layout: root.horizontalLayout,
                paddingTop: 5,
                paddingRight: 8,
                paddingBottom: 5,
                paddingLeft: 8,
                background: am5.RoundedRectangle.new(root, {
                    fill: am5.color(0xffffff),
                    fillOpacity: 0.3,
                }),
            }),
        );

        function createButton(
            text: string,
            projection: any,
            isGlobe: boolean = false,
        ) {
            const button = buttons.children.push(
                am5.Button.new(root, {
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    marginLeft: 5,
                    marginRight: 5,
                    label: am5.Label.new(root, {
                        text: text,
                        fontSize: "12px",
                        fontWeight: "500",
                    }),
                }),
            );

            button.events.on("click", function () {
                chart.set("projection", projection);
                if (isGlobe) {
                    chart.set("panX", "rotateX");
                    chart.set("panY", "rotateY");
                } else {
                    chart.set("panX", "translateX");
                    chart.set("panY", "translateY");
                }
            });
        }

        createButton("2D", am5map.geoMercator());
        createButton("Flat", am5map.geoNaturalEarth1());
        createButton("Globe", am5map.geoOrthographic(), true);

        // Create polygon series (countries)
        polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                exclude: ["AQ"],
            }),
        );

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            fillOpacity: 0.8,
            interactive: true,
        });

        const colorSet = am5.ColorSet.new(root, {});
        let colorIndex = 0;

        polygonSeries.mapPolygons.template.adapters.add(
            "fill",
            function (fill: any, target: any) {
                if (colorIndex < 10) {
                    colorIndex++;
                } else {
                    colorIndex = 0;
                }
                const dataContext: any = target.dataItem?.dataContext;
                if (!dataContext.colorWasSet) {
                    dataContext.colorWasSet = true;
                    const color = am5.Color.saturate(
                        colorSet.getIndex(colorIndex),
                        0.3,
                    );
                    target.setRaw("fill", color);
                    return color;
                } else {
                    return fill;
                }
            },
        );

        polygonSeries.mapPolygons.template.states.create("hover", {
            fillOpacity: 1,
        });

        // Create blast zone series - diurutkan dari terluar ke terdalam
        // Agar zona terkecil (fireball) tampil di atas

        // Helper function untuk create zone series
        function createZoneSeries(
            name: string,
            color: string,
            opacity: number,
            animDuration: number,
            animDelay: number,
        ) {
            const series = chart.series.push(
                am5map.MapPointSeries.new(root, {}),
            );

            series.bullets.push(function (
                root: any,
                series: any,
                dataItem: any,
            ) {
                const circle = am5.Circle.new(root, {
                    radius: 0,
                    fillOpacity: opacity,
                    fill: am5.color(color),
                    tooltipText: `{zoneName}: {radius} km`,
                });

                // Animasi expand dengan delay
                setTimeout(() => {
                    circle.animate({
                        key: "radius",
                        from: 0,
                        to: dataItem.dataContext.radius,
                        duration: animDuration,
                        easing: am5.ease.out(am5.ease.cubic),
                    });

                    // Pulse effect untuk shockwave
                    if (name.includes("Blast")) {
                        for (let i = 0; i < ANIMATION.pulseRepeat; i++) {
                            setTimeout(
                                () => {
                                    circle.animate({
                                        key: "fillOpacity",
                                        from: opacity,
                                        to: opacity * 0.3,
                                        duration: ANIMATION.pulseDuration / 2,
                                        easing: am5.ease.inOut(am5.ease.cubic),
                                    });

                                    // Chain dengan nested timeout
                                    setTimeout(() => {
                                        circle.animate({
                                            key: "fillOpacity",
                                            from: opacity * 0.3,
                                            to: opacity,
                                            duration:
                                                ANIMATION.pulseDuration / 2,
                                            easing: am5.ease.inOut(
                                                am5.ease.cubic,
                                            ),
                                        });
                                    }, ANIMATION.pulseDuration / 2);
                                },
                                i * ANIMATION.pulseDuration + animDuration,
                            );
                        }
                    }
                }, animDelay);

                return am5.Bullet.new(root, { sprite: circle });
            });

            return series;
        }

        // Buat series untuk setiap zona (dari terluar ke terdalam)
        thermalSeries = createZoneSeries(
            "Thermal Radiation",
            BLAST_ZONE_COLORS.thermal,
            BLAST_ZONE_OPACITY.thermal,
            ANIMATION.duration.thermal,
            ANIMATION.delay.thermal,
        );

        lightBlastSeries = createZoneSeries(
            "Light Blast",
            BLAST_ZONE_COLORS.lightBlast,
            BLAST_ZONE_OPACITY.lightBlast,
            ANIMATION.duration.lightBlast,
            ANIMATION.delay.lightBlast,
        );

        moderateBlastSeries = createZoneSeries(
            "Moderate Blast",
            BLAST_ZONE_COLORS.moderateBlast,
            BLAST_ZONE_OPACITY.moderateBlast,
            ANIMATION.duration.moderateBlast,
            ANIMATION.delay.moderateBlast,
        );

        heavyBlastSeries = createZoneSeries(
            "Heavy Blast",
            BLAST_ZONE_COLORS.heavyBlast,
            BLAST_ZONE_OPACITY.heavyBlast,
            ANIMATION.duration.heavyBlast,
            ANIMATION.delay.heavyBlast,
        );

        radiationSeries = createZoneSeries(
            "Radiation",
            BLAST_ZONE_COLORS.radiation,
            BLAST_ZONE_OPACITY.radiation,
            ANIMATION.duration.radiation,
            ANIMATION.delay.radiation,
        );

        fireballSeries = createZoneSeries(
            "Fireball",
            BLAST_ZONE_COLORS.fireball,
            BLAST_ZONE_OPACITY.fireball,
            ANIMATION.duration.fireball,
            ANIMATION.delay.fireball,
        );

        // Fallout pattern series (polygon)
        falloutSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {}),
        );

        falloutSeries.mapPolygons.template.setAll({
            templateField: "polygonSettings",
            tooltipText: "{tooltipText}",
            stroke: am5.color(0x00aa00),
            strokeWidth: 0.5,
        });

        // Wind indicator series (point)
        windSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        windSeries.bullets.push(function () {
            const container = am5.Container.new(root, {
                centerX: am5.p50,
                centerY: am5.p50,
            });

            const arrow = container.children.push(
                am5.Graphics.new(root, {
                    stroke: am5.color(0xffffff),
                    strokeWidth: 2,
                    fill: am5.color(0x33ff33),
                    fillOpacity: 1,
                    centerX: am5.p50,
                    centerY: am5.p50,
                    svgPath: "M0,0 L10,5 L0,10 L3,5 Z",
                    scale: 2,
                    templateField: "graphicSettings",
                }),
            );

            return am5.Bullet.new(root, {
                sprite: container,
            });
        });

        // Handle country click
        polygonSeries.mapPolygons.template.events.on(
            "click",
            function (ev: any) {
                const dataItem: any = ev.target.dataItem;
                const countryName =
                    dataItem.dataContext.name || "Tidak diketahui";

                // Get centroid coordinates
                // amCharts polygon geometry might not have direct centroid
                // We need to calculate it or use approximation
                let latitude = 0;
                let longitude = 0;

                // Try to get from polygon's visualLongitude/visualLatitude
                if (
                    ev.target.visualLongitude !== undefined &&
                    ev.target.visualLatitude !== undefined
                ) {
                    longitude = ev.target.visualLongitude();
                    latitude = ev.target.visualLatitude();
                } else if (
                    dataItem.get("longitude") !== undefined &&
                    dataItem.get("latitude") !== undefined
                ) {
                    // Fallback to dataItem properties
                    longitude = dataItem.get("longitude");
                    latitude = dataItem.get("latitude");
                } else {
                    // Method 2: Calculate from geometry coordinates
                    const geometry = dataItem.dataContext.geometry;
                    if (geometry && geometry.coordinates) {
                        // Simple centroid calculation for polygon
                        if (geometry.type === "Polygon") {
                            const coords = geometry.coordinates[0]; // First ring (outer boundary)
                            let sumLat = 0,
                                sumLon = 0,
                                count = 0;
                            for (const coord of coords) {
                                sumLon += coord[0];
                                sumLat += coord[1];
                                count++;
                            }
                            longitude = sumLon / count;
                            latitude = sumLat / count;
                        } else if (geometry.type === "MultiPolygon") {
                            // For MultiPolygon, use first polygon's centroid
                            const coords = geometry.coordinates[0][0]; // First polygon, first ring
                            let sumLat = 0,
                                sumLon = 0,
                                count = 0;
                            for (const coord of coords) {
                                sumLon += coord[0];
                                sumLat += coord[1];
                                count++;
                            }
                            longitude = sumLon / count;
                            latitude = sumLat / count;
                        }
                    }

                    // Method 3: Use visual bounds as last resort
                    if (latitude === 0 && longitude === 0) {
                        const bbox = ev.target.geoBounds();
                        if (bbox) {
                            longitude = (bbox.left + bbox.right) / 2;
                            latitude = (bbox.top + bbox.bottom) / 2;
                        } else {
                            console.warn(
                                "Could not determine centroid for",
                                countryName,
                            );
                            return;
                        }
                    }
                }

                const centroid = [longitude, latitude];

                // Validate coordinates
                if (!isValidCoordinates(latitude, longitude)) {
                    console.error("Invalid coordinates:", {
                        latitude,
                        longitude,
                    });
                    alert("Koordinat tidak valid. Silakan pilih lokasi lain.");
                    return;
                }

                // Validate and sanitize country name
                const countryValidation = validateCountryName(countryName);
                if (!countryValidation.valid) {
                    console.error(
                        "Invalid country name:",
                        countryValidation.error,
                    );
                    alert(countryValidation.error);
                    return;
                }
                const sanitizedCountryName = countryValidation.value;

                // Run the simulation
                runSimulation(latitude, longitude, sanitizedCountryName);
            },
        );
        // Add zoom control
        const zoomControl = chart.set(
            "zoomControl",
            am5map.ZoomControl.new(root, {}),
        );
        zoomControl.homeButton.set("visible", true);

        // Map loaded, hide loading screen
        isLoading = false;
    });

    let lastSimLocation: { lat: number; lon: number; name: string } | null =
        null;

    /**
     * Run simulation at specific coordinates
     */
    async function runSimulation(
        latitude: number,
        longitude: number,
        countryName: string,
    ) {
        lastSimLocation = { lat: latitude, lon: longitude, name: countryName };

        // Clear existing data from all series
        thermalSeries.data.clear();
        lightBlastSeries.data.clear();
        moderateBlastSeries.data.clear();
        heavyBlastSeries.data.clear();
        radiationSeries.data.clear();
        fireballSeries.data.clear();
        falloutSeries.data.clear();
        windSeries.data.clear();

        isCalculating = true;

        const blastData = calculateBlastRadius($selectedBomb.yieldKt);
        const population = estimatePopulationAffected(
            blastData.thermal,
            latitude,
            longitude,
            countryName,
        );

        const metrics = calculateDetailedMetrics(
            blastData,
            latitude,
            longitude,
            countryName,
        );

        // Weather logic
        let wind;
        if ($useRealTimeWeather) {
            try {
                const weatherData = await fetchRealTimeWeather(
                    latitude,
                    longitude,
                );
                wind = {
                    direction: weatherData.windDirection,
                    speed: weatherData.windSpeed,
                    isRealTime: true,
                };
            } catch (e) {
                console.error("Failed to fetch real-time weather:", e);
                wind = generateRandomWind();
            }
        } else {
            wind = generateRandomWind();
        }

        const falloutPattern = calculateFalloutPattern(
            latitude,
            longitude,
            $selectedBomb.yieldKt,
            wind,
        );

        const centroid = [longitude, latitude];
        const pointGeometry = { type: "Point", coordinates: centroid };

        // Add wind indicator (arrow pointing to fallout)
        windSeries.data.push({
            geometry: pointGeometry,
            graphicSettings: {
                rotation: wind.direction - 90, // Adjustment for SVG path orientation
            },
        });

        // Push data to series - this triggers animations automatically
        thermalSeries.data.push({
            zoneName: "Thermal Radiation",
            radius: blastData.thermal,
            geometry: pointGeometry,
        });

        lightBlastSeries.data.push({
            zoneName: "Light Blast (1 psi)",
            radius: blastData.lightBlast,
            geometry: pointGeometry,
        });

        moderateBlastSeries.data.push({
            zoneName: "Moderate Blast (5 psi)",
            radius: blastData.moderateBlast,
            geometry: pointGeometry,
        });

        heavyBlastSeries.data.push({
            zoneName: "Heavy Blast (20 psi)",
            radius: blastData.heavyBlast,
            geometry: pointGeometry,
        });

        radiationSeries.data.push({
            zoneName: "Radiation Zone",
            radius: blastData.radiation,
            geometry: pointGeometry,
        });

        fireballSeries.data.push({
            zoneName: "Fireball",
            radius: blastData.fireball,
            geometry: pointGeometry,
        });

        // Add fallout pattern with 3 layers for intensity visualization
        const windDirectionName =
            wind.direction +
            "° (" +
            (wind.isRealTime ? "Real-time" : "Simulated") +
            ")";

        // Low intensity fallout (outer layer)
        const falloutPointsLow = generateFalloutPolygon(falloutPattern, 1.0);
        falloutSeries.data.push({
            geometry: { type: "Polygon", coordinates: [falloutPointsLow] },
            polygonSettings: {
                fill: am5Core.color(FALLOUT_COLORS.low),
                fillOpacity: FALLOUT_OPACITY.low,
            },
            tooltipText: `Fallout Zone (Low Intensity)\nArah Angin: ${windDirectionName}\nKecepatan: ${wind.speed} km/jam`,
        });

        // Medium intensity fallout (middle layer)
        const falloutPointsMed = generateFalloutPolygon(falloutPattern, 0.6);
        falloutSeries.data.push({
            geometry: { type: "Polygon", coordinates: [falloutPointsMed] },
            polygonSettings: {
                fill: am5Core.color(FALLOUT_COLORS.medium),
                fillOpacity: FALLOUT_OPACITY.medium,
            },
            tooltipText: `Fallout Zone (Medium Intensity)`,
        });

        // High intensity fallout (inner layer)
        const falloutPointsHigh = generateFalloutPolygon(falloutPattern, 0.3);
        falloutSeries.data.push({
            geometry: { type: "Polygon", coordinates: [falloutPointsHigh] },
            polygonSettings: {
                fill: am5Core.color(FALLOUT_COLORS.high),
                fillOpacity: FALLOUT_OPACITY.high,
            },
            tooltipText: `Fallout Zone (High Intensity)`,
        });

        currentBlastData.set({
            countryName: countryName,
            blastData,
            population,
            fatalities: metrics.fatalities,
            injuries: metrics.injuries,
            infrastructure: metrics.infrastructure,
            wind,
            falloutPattern,
        });

        const blastEvent: BlastEvent = {
            id: generateId(),
            countryName: countryName,
            bombType: $selectedBomb,
            blastData,
            timestamp: Date.now(),
            coordinates: centroid,
            fatalities: metrics.fatalities,
            injuries: metrics.injuries,
            infrastructure: metrics.infrastructure,
        };

        addBlastToHistory(blastEvent);
        isCalculating = false;
    }

    /**
     * Replay last simulation
     */
    export function replaySimulation() {
        if (lastSimLocation) {
            runSimulation(
                lastSimLocation.lat,
                lastSimLocation.lon,
                lastSimLocation.name,
            );
        }
    }

    /**
     * Seek simulation progress (0-100)
     */
    export function seekSimulation(progress: number) {
        if (!thermalSeries) return;

        // Simplified logic to show/hide series based on progress milestones
        // Matching milestones in PlaybackControl.svelte

        // Detonation (progress > 5)
        fireballSeries.set("visible", progress > 5);
        radiationSeries.set("visible", progress > 5);

        // Shockwaves (progress > 30)
        heavyBlastSeries.set("visible", progress > 30);
        moderateBlastSeries.set("visible", progress > 30);
        lightBlastSeries.set("visible", progress > 30);

        // Thermal (progress > 70)
        thermalSeries.set("visible", progress > 70);

        // Fallout (progress > 90)
        falloutSeries.set("visible", progress > 90);
        windSeries.set("visible", progress > 90);

        // Optional: scale circles based on fine-grained progress for smoother effect
        // But for now, simple milestones are enough as per plan
    }

    /**
     * Pan and zoom map to specific location
     * Exported function that can be called from parent component
     */
    export function panToLocation(
        lat: number,
        lon: number,
        zoomLevel: number = 6,
    ) {
        if (!chart || !am5Core) return;

        chart.animate({
            key: "rotationX",
            to: 0,
            duration: 1000,
            easing: am5Core.ease.out(am5Core.ease.cubic),
        });

        chart.animate({
            key: "rotationY",
            to: 0,
            duration: 1000,
            easing: am5Core.ease.out(am5Core.ease.cubic),
        });

        // Zoom to location
        chart.goHome(0);
        setTimeout(() => {
            chart.zoomToGeoPoint(
                { latitude: lat, longitude: lon },
                zoomLevel,
                true,
            );
        }, 100);
    }

    onDestroy(() => {
        if (root) {
            root.dispose();
        }
    });
</script>

<div class="map-wrapper">
    {#if isLoading}
        <div class="loading-overlay">
            <div class="spinner"></div>
            <p>Memuat peta dunia...</p>
        </div>
    {/if}

    {#if isCalculating}
        <div class="calculating-indicator">
            <div class="calculating-spinner"></div>
            <span>Menghitung dampak ledakan...</span>
        </div>
    {/if}

    <div id={mapId} class="map-container"></div>
</div>

<style>
    .map-wrapper {
        position: relative;
        width: 100%;
    }

    .map-container {
        width: 100%;
        height: 600px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        background: var(--color-bg-secondary);
    }

    /* Loading Overlay */
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-bg-primary);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-md);
        z-index: 100;
        border-radius: var(--radius-lg);
    }

    .loading-overlay p {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin: 0;
    }

    .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Calculating Indicator */
    .calculating-indicator {
        position: absolute;
        top: var(--space-md);
        right: var(--space-md);
        background: var(--color-bg-secondary);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        z-index: 50;
        animation: fadeIn 0.3s ease;
    }

    .calculating-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    .calculating-indicator span {
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        font-weight: 500;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .map-container {
            height: 400px;
        }
    }
</style>
