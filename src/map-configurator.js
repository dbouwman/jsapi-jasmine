if (!this.app || typeof this.app !== 'object') {
	this.app = {};
}
//Helper that will setup up an existing map with 
//basemap and layers as defined in json configuration
//It's sometimes useful to configure an existing map
//so the rest of the app can listen to events as 
//it's being loaded up (i.e. layer-added)
app.MapConfigurator = {
	load: function(esriMap, json, callback){
		//do some checking...
		if(!esriMap){
			throw 'esriMap can not be null';
		}

		if(!json){
			throw 'webMapJson can not be null';
		}
		if(callback){
			//callback is not required, but can be useful
			esriMap.on('layers-add-result', function(results){
				callback(results);
			} );
		}
		//define an array of layers to add, and do it all at once
		//so we can leverage the 'layers-add-result' event
		//for our callback
		var map_layers=[];
		//basemap
		if(json.basemap){
			//remove any existing layers in the map
			esriMap.removeAllLayers();
			//incredibly naieve implementation here... pass more config in
			//so you can set the id, visibility etc etc
			var l = new esri.layers.ArcGISTiledMapServiceLayer(json.basemap);
			map_layers.push(l);
		}

		if(json.layers && json.layers.length > 0){
			//create DynamicMapService layers and add them to the 
			//layer array
			_.each(json.layers, function(layer,key,list){
				var options = {
					visible: layer.visible,
					opacity: layer.opacity,
					id: layer.id
				};
				var l = new esri.layers.ArcGISDynamicMapServiceLayer(layer.url,options);
				l.setVisibleLayers(layer.visibleLayers);
				map_layers.push(l);
			},this);
		}

		if(json.featureLayers && json.featureLayers.length > 0){
			_.each(json.featureLayers, function(layer, key,list){
				//create a simple feature layer
				var l = new esri.layers.FeatureLayer(layer.url, {id:layer.id});
				map_layers.push(l);
			},this);
		}

		//add all the layers at once which will raise the event
		//to which the callback is connected
		esriMap.addLayers(map_layers);
	}
};