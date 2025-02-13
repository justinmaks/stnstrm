#!/bin/sh

# Use envsubst to replace $DOMAIN and $USE_SSL in the config template
envsubst '$DOMAIN $USE_SSL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
