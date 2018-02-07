## Setup
You'll need [Docker](https://www.docker.com/) 17.12.0 or higher, and [Docker compose](https://docs.docker.com/compose/) installed.

## Initialise the tile server
You can initialise the tile server by running the script

```
./initialise_tile_server    # Linux
initialise_tile_server.bat  # Linux type shell on Windows
```

This will start two containers - a Postgres database and a renderer/web server. It takes about 30s to run because it waits for the containers to be up and then restarts them. A network and a volume for the database will also be created. If the server is already running, this will check that it is up to date.

## Get some map data
Download a PBF file of OSM data from somewhere like [Geofabrik](http://download.geofabrik.de/).
If you'd like a set of these merged, you can do this using the [OSM PBF merger](https://github.com/bwindsor/osm-pbf-merger) container.

## Populate the database
### 1. Set Environment variables
These two variables need setting
```
export IMPORT_FROM=/c/Users/myusername/osm-server
export IMPORT_FILE=rhode-island-latest.osm.pbf
```
* `IMPORT_FROM` is the directory name on your computer. If you're using `docker-machine` on Windows, this is the directory location mounted inside the machine.
* `IMPORT_FILE` is just the name of the `osm.pbf` file which you want to import.

* On Windows, replace the word `export` with `SET`.

### 2. Import data
Once those environment variables are set, this will import your data:

`docker-compose -f docker-compose-importer.yml run --rm data-importer`

The import may also fail if there is insufficient RAM for the import. See the [Optimising Data Import](Updating.md#optimising-data-import) and [Hardware Requirements](Updating.md#hardware-requirements) sections.

**This step can take a very long time! Typically 8 hours for the UK, and few days for the USA.**

## Restart the tile server
Once data import is complete, you should restart the tile server with

```
docker-compose restart
```
You'll then be able to find a map page at `http://localhost`. If you've got your own web client, you'll find the tiles at `http://localhost/osm-tiles/{z}/{x}/{y}.png` where `z` is the zoom coordinate and `x` and `y` are the tile coordinates for that zoom level. For a basic test visit `http://localhost/osm-tiles/0/0/0.png` and see if you can see the world. Replace `localhost` with the IP of your docker machine (usually `192.168.99.100`) if you're on Windows.

### 3. Set tile server as a service (optional)
You'll need the service config file in `service/tile-server.service`. Follow these steps to set up the service:

```
# 1. Create a user in the docker group who will run the service (-M specifies no home folder, -G specifies additional groups to add them to)
useradd -M -G docker tileserver
# 2. Copy the service file into the correct system folder
cp service/tile-server.service /etc/systemd/system/tile-server.service
# 3. Make sure it has the correct permissions for a service file
chmod 644 /etc/systemd/system/tile-server.service
# 4. Get systemd to reload service configurations
systemctl daemon-reload
# 5. Make the tile server run at start up
systemctl enable tile-server.service
```

Now you'll be able to control the starting/stopping of the tile server with
```
systemctl start tile-server
systemctl stop tile-server
systemctl restart tile-server
```
