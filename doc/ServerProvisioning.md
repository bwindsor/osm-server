## Provisioning a Centos Tile Server
A Provisiofile is provided which will set up a CentOS 7 server ready to provide map data. See [provisio](https://github.com/chmcewan/Provisio) for more information.

1. Install Provisio:
```
curl -s https://raw.githubusercontent.com/bwindsor/Provisio/master/provisio > /usr/bin/provisio
chmod +x /usr/bin/provisio
```
2. Grab the Provisiofile from this repository
```
curl -s https://raw.githubusercontent.com/bwindsor/osm-server/master/Provisiofile > Provisiofile
```
3. The Provisiofile currently downloads the UK and NI sections of the world and merges them. If required, modify the `declare_list_of_map_files_to_download` task at the very top of the `Provisiofile` to import sections of your choice. If you want to prerender tiles, you should edit the `prerender_tiles` task to call `render_list_geo` with the required arguments. See [tile pre-rendering](Updating.md#tile-pre-rendering).
4. Run the provisioner.
The `NO_MAP_IMPORT` environment variable tells the provisioner that it NOT download or import any map data.
The `UPDATING_REPO` environment variable tells the provisioner that it should pull the latest code from this repo (requires internet).
If you subsequently re-run the provisioner, for example if you have updated the map style, but NOT the map data itself, you should set the environment variable `NO_MAP_IMPORT` to save hours wasted waiting for the database import when the map data hasn't even changed.
```
provisio up
```

On subsequent runs, to prevent a re-import of the map
```
export NO_MAP_IMPORT=1
provisio up
```

## Troubleshooting
Sometimes, for some reason, when you restart the tile server it might fail to clean up the apache PID file, which leads to the web server not starting correctly. If this happens, you can delete this file manually with

`docker exec -it --user root $(docker ps | grep tile-server | awk '{print $1;}') /bin/bash -c 'rm -f $APACHE_PID_FILE'`

and then restart the containers with `docker-compose restart`.

## Provisioning on a network with no internet connection
1. Run Provisio as above on an internet connected machine
2. Burn a disc (or equivalent) containing the following
    * `provisio`
    * `Provisiofile`
    * Entire `.provisio` folder which will have been created in the same directory as where you ran provisio up from
3. Import the contents of this disc, put provisio on the path and make sure its executable, and from the same folder which contains the `Provisiofile` and `.provisio` folder, and then `provisio up`.