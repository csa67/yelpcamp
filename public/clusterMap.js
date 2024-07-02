maptilersdk.config.apiKey = mapToken;
var map = new maptilersdk.Map({
    container: 'cluster-map',
    zoom: 0.3,
    center: [0, 20],
    style: maptilersdk.MapStyle.DATAVIZ.DARK
});

map.on('load', function () {
//Adding data from db.
map.addSource('campgrounds', {
    'type': 'geojson',
    'data': campgroundList,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});

map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 20
    //   * Yellow, 30px circles when point count is between 20 and 40
    //   * Pink, 40px circles when point count is greater than or equal to 40
    'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        20,
        '#f1f075',
        40,
        '#f28cb1'
    ],
    'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
    ]
    }
});

map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
});

map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#11b4da',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
});

// inspect a cluster on click
map.on('click', 'clusters', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    var clusterId = features[0].properties.cluster_id;
    map.getSource('campgrounds').getClusterExpansionZoom(
    clusterId,
    function (err, zoom) {
        if (err) return;

        map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
        });
    }
    );
});

// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var mag = e.features[0].properties.popUpMarkup;
   
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new maptilersdk.Popup()
    .setLngLat(coordinates)
    .setHTML(
        `<p>${mag}</p>`
    )
    .addTo(map);
});

map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
});
});
