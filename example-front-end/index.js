var main = function() {

    var TILE_SERVER_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    var createMap = function() {
        let container = document.createElement("div")
        container.id = "map"
        container.style.height = "100vh"
        document.body.appendChild(container)

        // set up the map
        let map = L.map("map").setView(
            L.latLng(52.2053, 0.1218),  // Map centre
            15                          // Map zoom level
        )
        map.addLayer(L.tileLayer(TILE_SERVER_URL,
            {
                minZoom: 8,
                maxZoom: 20,
                attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            }
        ));

        // Add a scale bar
        L.control.scale().addTo(map);

        return map
    }
    
    var mainFunction = function() {
        let map = createMap()
    }
    
    return mainFunction;
}()