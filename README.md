# lab.rtin.page

Mobile-first dashboard for hosted services behind Cloudflare Access.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Config

Mount `config/services.yaml` into the container at `/config/services.yaml`.

```yaml
services:
  - title: Immich
    description: Photos and albums
    url: https://photos.lab.rtin.page
    icon: immich
    healthUrl: http://immich-server:2283/server/ping
```

`url` is what users open. `healthUrl` is what the dashboard container checks
from inside Docker or the LAN.

Icons use selfh.st references by default:

```yaml
icon: paperless-ngx
```

This resolves to `https://cdn.jsdelivr.net/gh/selfhst/icons/svg/paperless-ngx.svg`.

## Docker

```bash
docker compose up -d
```

GitHub Actions publishes an amd64 image to GHCR on pushes to `main` and tags.
