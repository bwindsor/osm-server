## Customising the map style
In `tile-server-container/MapStyle` you will find the [OSM Bright](https://github.com/mapbox/osm-bright) style configured for this system. You can edit it manually by changing the `mss` files. For more advanced customisation you can use [Tilemill](https://tilemill-project.github.io/tilemill/) to edit it.

After modifying the style you will need to rebuild and replace the tile server container. This can be done simply by running the [initialise tile server](Install.md#initialise-the-tile-server) command above.