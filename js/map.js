(function ($) {

    "use strict";

    // Define map layers
	var mapLayers = {
        congrDist_TL: L.mapbox.tileLayer('computech.hj38elg7'),
        congrDist_GL: L.mapbox.gridLayer('computech.hj38elg7'),
        cnty_TL: L.mapbox.tileLayer('computech.hj2ghocl'),
        cnty_GL: L.mapbox.gridLayer('computech.hj2ghocl'),
        schoolDist_TL: L.mapbox.tileLayer('computech.hin0bi84'),
        schoolDist_GL: L.mapbox.gridLayer('computech.hin0bi84')
    },
        eRateMap = {
            init: function () {
                var map = L.mapbox.map('map').setView([37.055, -115.576], 5),
                    hash = L.hash(map);

                L.control.fullscreen().addTo(map);
				//L.control.attribution({position: 'bottomleft'}).setPrefix(image).addTo(map);
                map.scrollWheelZoom.disable();

                this.activeLayerGroup = new L.LayerGroup();
                this.addLayers(map, mapLayers.congrDist_TL, mapLayers.congrDist_GL);

                $('.list-layerSwitch').on('click', 'li', {
                    map: map
                }, eRateMap.switchLayer);
				
				eRateMap.addMarkers(map);
            },
			addMarkers: function (mapMarker) { 
				var markers = new L.MarkerClusterGroup(),
					features = schools[0].features,
					featuresLen = features.length;

		        for (var i = 0; i < featuresLen; i++) { 
		            var coords = features[i].geometry.coordinates;
		            var title = features[i].properties.SCHOOL_NAM;
		            var marker = L.marker(new L.LatLng(coords[1], coords[0]), {
		                icon: L.mapbox.marker.icon({'marker-symbol': 'school', 'marker-color': '0044FF'}),
		                title: title
		            });
					
		            marker.bindPopup(title);
		            markers.addLayer(marker);
		        }
		    
		        mapMarker.addLayer(markers);
			},
            addLayers: function (map, layer_TL, layer_GL) {
                eRateMap.activeLayerGroup.addLayer(layer_TL);
                eRateMap.activeLayerGroup.addLayer(layer_GL);
                //eRateMap.activeLayerGroup.addLayer(congrDist_GC);
                eRateMap.activeLayerGroup.addTo(map);
                L.mapbox.gridControl(layer_GL.on('click', eRateMap.getMapData));
            },
            switchLayer: function (event) {

                var targetID = event.target.id,
                    tile_TL = mapLayers[targetID + '_TL'],
                    tile_GL = mapLayers[targetID + '_GL'],
                    mapDesc = event.target.getAttribute('href');

                event.preventDefault();
				
				eRateMap.clearMapData();
                eRateMap.activeLayerGroup.clearLayers();
                eRateMap.addLayers(event.data.map, tile_TL, tile_GL);

                $('.list-layerSwitch').find('.active').removeClass('active');
                $('#' + targetID).addClass('active');

                // Show map description
				$('#content-main').find('.map-desc').addClass('hide');
                $(mapDesc).removeClass('hide');
            },
            getMapData: function (o) {
                var data;
				
				function toTitleCase (str) {
					str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				        return letter.toUpperCase();
				    });
					
					return str;
				}

                if (o.data !== undefined) {
                    data = o.data;

                    // Populate stats
                    $('#stat-geography').text(data.GEOGRAPHY_);
                    $('#stat-geoID').text(data.GEOGRAP_01);
                    $('#stat-state').text(toTitleCase(data.STATE));
					$('#stat-geoDesc').text(toTitleCase(data.GEOGRAP_02));
                    $('#stat-pctSchool').text(data.PCT_SCHOOL);
                    $('#stat-totSchools').text(data.TOTAL_SCHO);
                    $('#stat-fiber').text(data.WITH_FIBER);

                } else { 
                    eRateMap.clearMapData();
                }
            },
			clearMapData: function () {
				$('#stat-state').text('--');
                $('.dl-stats').find('span').text('----');
			}
        };

    eRateMap.init();

}(jQuery));