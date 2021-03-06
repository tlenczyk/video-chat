#!/usr/bin/env bash

# create a self signed cert for the server
mkdir -p $DEPS_HOME/certs/
openssl req \
  -new \
  -newkey rsa:4096 \
  -days 365 \
  -nodes \
  -x509 \
  -subj "/C=AU/ST=NSW/L=Sydney/O=JanusDemo/CN=janus.test.com" \
  -keyout $DEPS_HOME/certs/janus.key \
  -out $DEPS_HOME/certs/janus.pem

wget https://github.com/meetecho/janus-gateway/archive/$JANUS_RELEASE.tar.gz -O  $DEPS_HOME/dl/janus.tar.gz

cd $DEPS_HOME/dl
tar xf janus.tar.gz
cd janus*
./autogen.sh

# ./configure --prefix=$DEPS_HOME --disable-rabbitmq --disable-docs
./configure --prefix=$DEPS_HOME \
--disable-rabbitmq \
--disable-docs \
--disable-websockets \
--disable-mqtt \
--disable-unix-sockets \
--disable-plugin-echotest \
--disable-plugin-audiobridge \
--disable-plugin-recordplay \
--disable-plugin-sip \
--disable-plugin-streaming \
--disable-plugin-videocall \
--disable-plugin-voicemail \
--disable-plugin-textroom

make -j4
make install
make configs


# mkdir -p $CONFIG_PATH

# # make the janus configuration
# cat << EOF > $CONFIG_PATH/janus.cfg
# [general]
# configs_folder=$CONFIG_PATH
# plugins_folder=$DEPS_HOME/lib/janus/plugins
# debug_level=4

# [webserver]
# base_path=/janus
# threads=unlimited
# http=yes
# https=yes
# secure_port=8089

# [admin]
# admin_base_path=/admin
# admin_threads=unlimited
# admin_http=yes
# admin_https=yes
# admin_secure_port=7889
# ; admin_acl=127.0.0.1

# [certificates]
# cert_pem=$DEPS_HOME/certs/janus.pem
# cert_key=$DEPS_HOME/certs/janus.key
# EOF

# mv $CONFIG_PATH/janus.plugin.echotest.cfg.sample janus.plugin.echotest.cfg
# mv $CONFIG_PATH/janus.transport.http.cfg.sample janus.transport.http.cfg
