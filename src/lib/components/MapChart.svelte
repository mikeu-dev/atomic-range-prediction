<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    import {
        selectedBomb,
        currentBlastData,
        addBlastToHistory,
    } from "$lib/stores/appStore";
    import {
        calculateBlastRadius,
        estimatePopulationAffected,
        generateId,
    } from "$lib/utils/blastCalculator";
    import {
        generateRandomWind,
        calculateFalloutPattern,
    } from "$lib/utils/windEffects";
    import {
        BLAST_ZONE_COLORS,
        BLAST_ZONE_OPACITY,
        ANIMATION,
    } from "$lib/utils/constants";
    import type { BlastEvent } from "$lib/types";

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

    onMount(async () => {
        if (!browser) return;

        // Dynamic import untuk avoid SSR issues
        const am5 = await import("@amcharts/amcharts5");
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

        function createButton(text: string, projection: any) {
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
                    }),
                }),
            );

            button.events.on("click", function () {
                chart.set("projection", projection);
            });
        }

        createButton("EqualEarth", am5map.geoEqualEarth());
        createButton("Equirect", am5map.geoEquirectangular());
        createButton("Mercator", am5map.geoMercator());
        createButton("NaturalEarth", am5map.geoNaturalEarth1());
        createButton("Ortho", am5map.geoOrthographic());

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
            fill: am5.color(0x00ff00),
            fillOpacity: 0.3,
            stroke: am5.color(0x00aa00),
            strokeWidth: 1,
            tooltipText: "Fallout Zone",
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

                const blastData = calculateBlastRadius($selectedBomb.yieldKt);
                const population = estimatePopulationAffected(
                    blastData.thermal,
                );
                const infrastructure = Math.round(70 + Math.random() * 30);

                // Generate wind configuration
                const wind = generateRandomWind();

                // Calculate fallout pattern
                const falloutPattern = calculateFalloutPattern(
                    latitude, // latitude
                    longitude, // longitude
                    $selectedBomb.yieldKt,
                    wind,
                );

                // Add all blast zones to map
                const pointGeometry = { type: "Point", coordinates: centroid };

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

                // Add fallout pattern (simplified ellipse)
                // TODO: Implement proper ellipse generation
                // For now, skip fallout visualization to avoid complexity

                // Update current blast data
                currentBlastData.set({
                    countryName,
                    blastData,
                    population,
                    infrastructure,
                });

                // Add to history
                const blastEvent: BlastEvent = {
                    id: generateId(),
                    countryName,
                    bombType: $selectedBomb,
                    blastData,
                    timestamp: Date.now(),
                    coordinates: centroid,
                };

                addBlastToHistory(blastEvent);
            },
        );
        // Add zoom control
        const zoomControl = chart.set(
            "zoomControl",
            am5map.ZoomControl.new(root, {}),
        );
        zoomControl.homeButton.set("visible", true);
    });

    onDestroy(() => {
        if (root) {
            root.dispose();
        }
    });
</script>

<div id={mapId} class="map-container"></div>

<style>
    .map-container {
        width: 100%;
        height: 600px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        background: var(--color-bg-secondary);
    }

    @media (max-width: 768px) {
        .map-container {
            height: 400px;
        }
    }
</style>
