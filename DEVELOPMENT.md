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

### 2. Choose necessary VPM repositories.

> [!TIP]
> In the later step, setup scripts will download then extract a ton of packages from the repositories.
> For quick development, you can choose necessary repositories by editing `repositories.txt`.

### 3. Download VPM repositories.

```shell
./tasks/download-repos.sh
```

Repository JSON files will be saved in `vpm/repos` directory.

### 4. Download VPM packages.

```shell
./tasks/download-packages.sh
```

Package zip files will be saved in `vpm/zips` directory. And extracted files will be saved in `vpm/packages` directory.

### 5. Run the development server.

```shell
pnpm run dev
```

The development server will be available at `http://localhost:4321`.

## Frameworks

Main frameworks used in this project:

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
