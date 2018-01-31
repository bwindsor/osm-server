FROM smartroadsense/osm-tiles

USER root

# Copy the render list script into the container
COPY render_list_geo.pl /usr/bin/render_list_geo
RUN chmod +x /usr/bin/render_list_geo

# Copy the front end into the container
COPY front-end /var/www/html

# These commands overwrite the files already in the container and rebuild the style files
RUN rm -rf /opt/osm-bright-master/OSMBright
COPY MapStyle /opt/osm-bright-master/OSMBright
RUN cd /opt/osm-bright-master/OSMBright/ && \
      carto project.mml > OSMBright.xml && \
    chmod 777 OSMBright.xml

USER www-data