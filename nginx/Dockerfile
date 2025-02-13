FROM nginx:stable

RUN apt-get update && apt-get install -y gettext-base

# Copy certs if you want them baked into the image
# For instance:
COPY certs/fullchain.pem /etc/nginx/certs/fullchain.pem
COPY certs/privkey.pem /etc/nginx/certs/privkey.pem

# Copy the template for default.conf
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the entry script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
