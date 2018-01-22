# osm-server

This provides an open street map file server inside Docker containers.

## Setup
You'll need [Docker](https://www.docker.com/) and [Docker compose](https://docs.docker.com/compose/) installed.

### Create a docker volume
This will be used to be used in storing data by the Postgres database

`docker volume create --name osm_postgres_database`

You must call it this as the `docker-compose` files will later look for a volume with this name.

### Get some map data
Download a PBF file of OSM data from somewhere like [Geofabrik](http://download.geofabrik.de/).
If you'd like a set of these merged, you can do this using the [OSM PBF merger](https://github.com/bwindsor/osm-pbf-merger) container.

### Populate the database
#### Set Environment variables
These two variables need setting
```
export LOCAL_IMPORT_DIRECTORY=/c/Users/myusername/osm-server
export IMPORT_FILENAME=rhode-island-latest.osm.pbf
```
`LOCAL_IMPORT_DIRECTORY` is the directory name on your computer. If you're using `docker-machine` on Windows, this is the directory location mounted inside the machine.

`IMPORT_FILENAME` is just the name of the `osm.pbf` file which you want to import.

On Windows, replace the word `export` with `SET`.

#### Import data
Once those environment variables are set, this will import your data:

`docker-compose -f docker-compose-importer.yml up --abort-on-container-exit`

This may fail the first time as the import will try to begin before the database is ready. Run it a second time and the db should be up in time.

**This step can take a very long time! Typically 8 hours for the UK, and few days for the USA.**

### Start the tile server
Once data import is complete, you can start the tile server with

`docker-compose up`

After a short time, the server will be up and running, and you'll be able to find tiles at `http://localhost/osm-tiles/{z}/{x}/{y}.png` where `z` is the zoom coordinate and `x` and `y` are the tile coordinates for that zoom level. for the most basic test then visit `http://localhost/osm-tiles/0/0/0.png` and see if you get anything. Replace `localhost` with the IP of your docker machine (usually `192.168.99.100`) if you're on Windows.

If you want to detach from the process and just leave it running away in the background without taking up your terminal, stop the server with Ctrl+C and then instead run

`docker-compose up -d`

### Stop the tile server
If your terminal is still attached, just do `Ctrl+C` and wait a few seconds for the containers to exit.

If the containers are running in the background, run

`docker-compose down`

This will remove the containers and the network connecting them. However, the docker volume you created with the imported data will remain intact. The data you lose by running this step is the cache of rendered map tiles stored inside the server container.

### Remove the database
Remove the database by running

`docker volume rm osm_postgres_database`

### Updating the tile server
1. Stop the server as in the `Stop the tile server` section.
2. Remove the database as in the `Remove the database` section. If you want to keep a backup of the database, you will need backup of the `osm_postgres_database` volume. [Here's an example of how to do that](https://loomchild.net/2017/03/26/backup-restore-docker-named-volumes/).
3. Create a new docker volume for the database as in the `Create a Docker Volume` section.
4. Follow the steps under `Populate the Database` above - i.e. set environment variables to import, and then run the import.
5. Start the server again as explained above.

### User Interface
This system provides a tile service - to view a map in a browser you'll need a front end web page which requests the tiles and displays them correctly. You can use [Leaflet](http://leafletjs.com/) to do this. Inside the folder `example-front-end` you'll see an example of such a page. You'll need to edit `index.js` to make `TILE_SERVER_URL` point to the tile server which you've just set up.

### Customising data import
You may with to customise the parameters which are passed to `osm2pgsql` which is the program which imports the data into the database. Changing these can vary the speed of the import quite significantly. In particular, giving it more RAM helps. You can edit the `docker-compose-importer.yml` file to change the `osm2pgsql` command. The `--cache` argument is how many MB of RAM can be used for the import. [Here's more information on import optimisation](https://wiki.openstreetmap.org/wiki/Osm2pgsql#Optimization)

### Hardware requirements
**Memory:** The more memory you can give the process, the better. Typically `--cache 4000` is enough for it not to be too slow, but `--cache 64000` on a beefy computer would be faster.

**Disk:** To import the USA you'll need about 250GB of disk space.

**CPU:** For rendering tiles quickly, more cores and faster speeds will lead to tiles loading faster for the user.