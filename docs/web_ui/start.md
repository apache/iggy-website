---
id: web-ui-iggy-web-ui
slug: /web-ui/iggy-web-ui
title: Iggy Web UI
sidebar_position: 1
---

Iggy Web UI provides a comprehensive dashboard for Iggy server. It allows you to monitor the server's health, streams, topics, browse the messages, users and more. The dashboard is built with Svelte and is available as [open-source repository](https://github.com/iggy-rs/iggy-web-ui/) as well as the Docker image on [Docker Hub](https://hub.docker.com/r/iggyrs/iggy-web-ui).

![Web UI](/img/iggy_web_ui.png)

Here's the full example of the `docker-compose.yml` file that starts the Iggy server, initializes it with the `my-stream` stream and `my-topic` topic with the help of [Iggy CLI](../cli/start.md), and eventually starts the Iggy Web UI:

```yaml
iggy:
  image: iggyrs/iggy:latest
  container_name: iggy
  restart: unless-stopped
  environment:
    - IGGY_ROOT_USERNAME=iggy
    - IGGY_ROOT_PASSWORD=Secret123!
    - IGGY_HTTP_ENABLED=true
    - IGGY_HTTP_ADDRESS=0.0.0.0:80
    - IGGY_TCP_ENABLED=true
    - IGGY_TCP_ADDRESS=0.0.0.0:3000
    - IGGY_QUIC_ENABLED=false
    - IGGY_HEARTBEAT_ENABLED=true
    - IGGY_HEARTBEAT_INTERVAL=5s
  ports:
    - "3010:80"
    - "5100:3000"
  networks:
    - iggy
  volumes:
    - iggy:/iggy/local_data

init-iggy:
  image: iggyrs/iggy:latest
  container_name: init-iggy
  networks:
    - iggy
  depends_on:
    - iggy
  entrypoint: [ '/bin/sh', '-c' ]
  command: |
    "
    echo 'Logging in to Iggy'
    iggy --tcp-server-address iggy:3000 --username iggy --password Secret123! login 1m

    echo 'Creating my-stream...'
    iggy --transport tcp --tcp-server-address iggy:3000 --username iggy --password Secret123! stream create my-stream
    echo 'Created my-stream'

    echo 'Creating my-stream topics...'
    iggy --tcp-server-address iggy:3000 --username iggy --password Secret123! topic create my-stream my-topic 1 none 7d
    echo 'Created my-stream topics`
    "

iggy-web-ui:
  image: iggyrs/iggy-web-ui:latest
  container_name: iggy-web-ui
  restart: unless-stopped
  environment:
    - PUBLIC_IGGY_API_URL=http://iggy:80
  ports:
    - "3050:3050"
  networks:
    - iggy

networks:
  iggy:

volumes:
  iggy:
```
