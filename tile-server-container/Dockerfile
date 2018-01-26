FROM smartroadsense/osm-tiles

COPY render_list_geo.pl /usr/bin/render_list_geo
COPY front-end /var/www/html

# These commands overwrite the files already in the container and rebuild the style files
USER root
RUN rm -rf /opt/osm-bright-master/OSMBright
COPY MapStyle /opt/osm-bright-master/OSMBright
RUN cd /opt/osm-bright-master/OSMBright/ && \
      carto project.mml > OSMBright.xml && \
    chmod 777 OSMBright.xml

USER www-data