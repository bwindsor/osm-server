## Architecture
There are three components to this system
### 1. Postgres database
This stores the OSM map data in the form of vertices, lines, etc. with associated metadata. The docker image used for this is a basic Postgres database with some extensions specific to OSM added. This image is pulled as-is from docker hub.
### 2. Web tile server/renderer
When a tile is requested at a certain zoom level and location, this container queries the database for the relevant data and then renders it into a png image. This png image is then cached inside the container, so expect this container to grow in size over time. This container is based on a tile server container from docker hub, but allowing for customisation of map style, and allowing for tile pre-rendering. This container must be rebuilt if the map style is modified.
### 3. Data importer
This isn't part of the running system, but this container contains `osm2pgsql`, a program to connect to the postgres database and populate it with data from a `.pbf` file. This container just runs during the import process and connects to the database container to populate it.

### Storage
* The database is stored in a docker volume which is mounted into the postgres container. This volume is created during the `docker-compose up` command. When `docker-compose down` destroys the containers, this volume is not destroyed but should not be reused - you can manually destroy it.
* The rendered png tiles are cached inside the web server container. As such the tile server container will grow in size over time. If the tile server container is re-created, cached tiles are lost.

### Networking
* A network is created by docker-compose which is connected to by all three containers. This allows them to communicate with each other.