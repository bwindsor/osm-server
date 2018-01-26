## Provisioning a Centos Tile Server
A Provisiofile is provided which will set up a CentOS 7 server ready to provide map data. See [provisio](https://github.com/chmcewan/Provisio) for more information.

1. Install Provisio:
```
curl -s https://raw.githubusercontent.com/chmcewan/Provisio/master/provisio > /usr/bin/provisio
chmod +x /usr/bin/provisio
```
2. Grab the Provisiofile from this repository
```
curl -s https://raw.githubusercontent.com/bwindsor/osm-server/master/Provisiofile > Provisiofile
```
3. Run the provisioner
The `UPDATING_MAP` environment variable tells the provisioner that it should re-run the map download and import tasks.
If you subsequently re-run the provisioner, for example if you have updated the map style, but not the map data itself, you should NOT set the environment variable.
```
export UPDATING_MAP=yes   # ONLY set this if you have changed the map data (or it's the first time)
provisio up
```

## Provisioning on a network with no internet connection
1. Run Provisio as above on an internet connected machine
2. Burn a disc (or equivalent) containing the following
    * `provisio`
    * `Provisiofile`
    * Entire `.provisio` folder which will have been created in the same directory as where you ran provisio up from
3. Import the contents of this disc, put provisio on the path and make sure its executable, and from the same folder which contains the `Provisiofile` and `.provisio` folder, run `export UPDATING_MAP=yes` and then `provisio up`.