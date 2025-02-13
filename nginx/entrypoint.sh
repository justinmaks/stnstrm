#!/bin/sh

# If USE_SSL=true, use ssl.conf.template; else default.conf.template
if [ "$USE_SSL" = "true" ]; then
  cp /etc/nginx/templates/ssl.conf.template /etc/nginx/conf.d/default.conf
else
  cp /etc/nginx/templates/default.conf.template /etc/nginx/conf.d/default.conf
fi

exec "$@"
