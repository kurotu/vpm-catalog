# VPM Catalog Development

## Required Environment

- Node.js 20.3.0 or later
- jq
- (Windows) Git Bash

## Setup

### 1. Install npm dependencies.

```shell
pnpm install
```

### 2. Download VPM repositories and packages.

```shell
pnpm run setup
```

By default, only a small subset of repositories listed in `repositories-dev.txt` is downloaded for faster local development.

To download all repositories (same as production), run:

```shell
VPM_REPOS_FILE=repositories.txt pnpm run setup
```

You can also point to any custom file:

```shell
VPM_REPOS_FILE=my-repos.txt pnpm run setup
```

Repository JSON files will be saved in `vpm/repos`, package zips in `vpm/zips`, and extracted packages in `vpm/packages`.

### 3. Run the development server.

```shell
pnpm run dev
```

The development server will be available at `http://localhost:4321`.

## Frameworks

Main frameworks used in this project:

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
