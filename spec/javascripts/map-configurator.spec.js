describe('Map Configurator', function(){

	describe(' validate parameters', function(){
		it('should throw if no webmap is passed in', function(){
			var config = {}; //for this test just needs to be non-null
			//the in-lining is an artefact of how jasmine works
			//expect wants a function, not the output of a function, so 
			//we wrap our call
			expect( function(){ app.MapConfigurator.load( null, config ); } ).toThrow();
		});

		it('should throw if no json is passed in', function(){
			var map = {}; //for this test just needs to be non-null
			//the in-lining is an artefact of how jasmine works
			//expect wants a function, not the output of a function, so 
			//we wrap our call
			expect( function(){ app.MapConfigurator.load( map, null ); } ).toThrow();	
		});

	});

	describe(' Map Loading', function(){
	
		it('should set the basemap tile service', function(){
			var data = getJSONFixture('basemap-only.json');
            var flag,localMap,divId = 'map-basemap-test';
            runs(function(){
                var flagCallback = function(result){
                    flag = true;
                };
                var actionCallback = function(map){
                    localMap = map;
                    app.MapConfigurator.load(map,data,flagCallback);
                };
                createTestMap( divId , actionCallback );
            });
            
            waitsFor(function(){
                return flag;
            }, 'the call to setup the webmap', 3000);
                
            runs( function(){
                //check that we have more than 0 layers - essentially make sure the map is loaded
                expect( localMap.layerIds.length ).toBeGreaterThan(0);
                //get the first layer - should be our basemap
                var layer = localMap.getLayer(localMap.layerIds[0]);
                //check that it's url matches what's in the test data
                expect(layer.url).toBe(data.basemap);
                //clean up
                localMap.destroy();//kill the map object
                $('#' + divId).remove();//kill from the dom
            });
		});

		it('should add specified layers as dynamic services', function(){
			var data = getJSONFixture('layers-only.json');
            var flag,localMap,divId = 'map-layers-test';
            runs(function(){
                var flagCallback = function(result){
                    flag = true;
                };
                var actionCallback = function(map){
                    localMap = map;
                    app.MapConfigurator.load(map,data,flagCallback);
                };
                createTestMap( divId , actionCallback );
            });
            
            waitsFor(function(){
                return flag;
            }, 'the call to setup the webmap', 5000);
                
            runs( function(){
                expect( localMap.layerIds.length ).toBe(3);
                //get the first layer - should be our basemap
                var layer = localMap.getLayer(data.layers[0].id);
                //check that the id was set by ensuring the the returned
                //object is defined
                expect(layer).toBeDefined();
                //check that it's url matches what's in the test data
                expect(layer.url).toBe(data.layers[0].url);
                expect(layer.visibleLayers).toBe(data.layers[0].visibleLayers);
                expect(layer.opacity).toBe(data.layers[0].opacity);
                //same for the second layer
                layer = localMap.getLayer(data.layers[1].id);
                expect(layer).toBeDefined();
                expect(layer.url).toBe(data.layers[1].url);
                expect(layer.visibleLayers).toBe(data.layers[1].visibleLayers);
                expect(layer.opacity).toBe(data.layers[1].opacity);

                //clean up
                localMap.destroy();//kill the map object
                $('#' + divId).remove();//kill from the dom
            });
		});

		it('should set specified feature layers', function(){
			var data = getJSONFixture('featurelayers-only.json');
            var flag,localMap,divId = 'map-flayers-test';
            runs(function(){
                var flagCallback = function(result){
                    flag = true;
                };
                var actionCallback = function(map){
                    localMap = map;
                    app.MapConfigurator.load(map,data,flagCallback);
                };
                createTestMap( divId , actionCallback );
            });
            
            waitsFor(function(){
                return flag;
            }, 'the call to setup the webmap', 5000);
                
            runs( function(){
				//just the basemap
                expect( localMap.layerIds.length ).toBe(1);
                //feature layers end up in graphicsLayers!
                expect( localMap.graphicsLayerIds.length ).toBe(1);
                //get the first layer - should be our basemap
                var layer = localMap.getLayer(data.featureLayers[0].id);
                //check that the id was set by ensuring the the returned
                //object is defined
                expect(layer).toBeDefined();
                //check that it's url matches what's in the test data
                expect(layer.url).toBe(data.featureLayers[0].url);
                //clean up
                localMap.destroy();//kill the map object
                $('#' + divId).remove();//kill from the dom
            });
		});

	});

});