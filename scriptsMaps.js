/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
    am5themes_Animated.new(root)
]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator()
    })
);

var colorSet = am5.ColorSet.new(root, {});

// Create main polygon series for time zone areas
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
var areaSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldTimeZoneAreasLow
    })
);

var areaPolygonTemplate = areaSeries.mapPolygons.template;
areaPolygonTemplate.setAll({
    fillOpacity: 0.6
});
areaPolygonTemplate.adapters.add("fill", function (fill, target) {
    return am5.Color.saturate(
        colorSet.getIndex(areaSeries.mapPolygons.indexOf(target)),
        0.5
    );
});

areaPolygonTemplate.states.create("hover", {
    fillOpacity: 0.8
});

// Create main polygon series for time zones
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
var zoneSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldTimeZonesLow
    })
);

zoneSeries.mapPolygons.template.setAll({
    fill: am5.color(0x000000),
    fillOpacity: 0.08
});

var zonePolygonTemplate = zoneSeries.mapPolygons.template;
zonePolygonTemplate.setAll({
    interactive: true,
    tooltipText: "{id}"
});
zonePolygonTemplate.states.create("hover", {
    fillOpacity: 0.3
});

// labels
var labelSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
labelSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
            text: "{id}",
            populateText: true,
            centerX: am5.p50,
            centerY: am5.p50,
            fontSize: "0.7em"
        })
    });
});

// create labels for each zone
zoneSeries.events.on("datavalidated", () => {
    am5.array.each(zoneSeries.dataItems, (dataItem) => {
        var centroid = dataItem.get("mapPolygon").visualCentroid();
        labelSeries.pushDataItem({
            id: dataItem.get("id"),
            geometry: {
                type: "Point",
                coordinates: [centroid.longitude, centroid.latitude]
            }
        });
    });
});

// Add zoom control
// https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

// Add labels and controls
var cont = chart.children.push(
    am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40
    })
);

cont.children.push(
    am5.Label.new(root, {
        centerY: am5.p50,
        text: "Map"
    })
);

var switchButton = cont.children.push(
    am5.Button.new(root, {
        themeTags: ["switch"],
        centerY: am5.p50,
        icon: am5.Circle.new(root, {
            themeTags: ["icon"]
        })
    })
);

switchButton.on("active", function () {
    if (!switchButton.get("active")) {
        chart.set("projection", am5map.geoMercator());
        chart.set("panX", "translateX");
        chart.set("panY", "translateY");
    } else {
        chart.set("projection", am5map.geoOrthographic());
        chart.set("panX", "rotateX");
        chart.set("panY", "rotateY");
    }
});

cont.children.push(
    am5.Label.new(root, {
        centerY: am5.p50,
        text: "Globe"
    })
);
// Make stuff animate on load
chart.appear(1000, 100);