//helper that injects a div, creates a map and 
//fires a callback when it's ready to roll
function createTestMap(divId, mapReadyCallback){
    $("body").append("<div id='" + divId + "' style='height:400px;width:400px'></div>");
    var map = new esri.Map(divId,{
        basemap:"topo",
        center:[-122.45,37.75],
        zoom:13,
        sliderStyle:"small"
    });

    dojo.connect(map,'onLoad', function(theMap){
        mapReadyCallback(theMap);
    });
}