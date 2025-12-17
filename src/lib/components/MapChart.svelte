<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as am5 from "@amcharts/amcharts5";
    import * as am5map from "@amcharts/amcharts5/map";
    import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
    import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

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
    import type { BlastEvent } from "$lib/types";

    export let mapId = "chartdiv";

    let root: am5.Root;
    let chart: am5map.MapChart;
    let polygonSeries: am5map.MapPolygonSeries;
    let explosionSeries: am5map.MapPointSeries;

    onMount(() => {
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
            function (fill, target) {
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

        // Create explosion series
        explosionSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                valueField: "radius",
                polygonIdField: "id",
            }),
        );

        explosionSeries.bullets.push(function (root, series, dataItem: any) {
            const circle = am5.Circle.new(root, {
                radius: dataItem.dataContext.radius,
                fillOpacity: 0.4,
                fill: am5.color(0xff0000),
                cursorOverStyle: "pointer",
                tooltipText: "{name}: {radius} km radius",
            });

            circle.animate({
                key: "radius",
                from: 0,
                to: dataItem.dataContext.radius,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic),
            });

            return am5.Bullet.new(root, { sprite: circle });
        });

        // Handle country click
        polygonSeries.mapPolygons.template.events.on("click", function (ev) {
            const dataItem: any = ev.target.dataItem;
            const centroid = dataItem.geometry;
            const countryName = dataItem.dataContext.name || "Tidak diketahui";

            const blastData = calculateBlastRadius($selectedBomb.yieldKt);
            const population = estimatePopulationAffected(blastData.thermal);
            const infrastructure = Math.round(70 + Math.random() * 30);

            // Add explosion to map
            explosionSeries.data.push({
                id: dataItem.get("id"),
                name: countryName,
                radius: parseFloat(blastData.thermal.toString()),
                geometry: { type: "Point", coordinates: centroid },
            });

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
        });

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
