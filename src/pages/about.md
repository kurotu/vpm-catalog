---
layout: ~/layouts/MarkdownLayout.astro
title: About VPM Catalog
---

## Contents

## What is VPM Catalog?

VPM Catalog is a curated list of VPM packages and repositories which can be used with VCC.
You can browse the catalog to find packages that you can use in your VRChat avatar of world projects.

### What is VCC?

VRChat Creator Companion (VCC) is a tool which is officially provided by VRChat to help creators manage their projects.
It can be used to import useful tools as VPM packages, manage dependencies, and more.
See the [VCC documentation](https://vcc.docs.vrchat.com/) for more information.

### What is VPM?

VRChat Package Manager (VPM) is a package format used by VCC and other compatible tools.
You can distribute your assets as VPM packages, and import them into your projects easily with VCC.
See the [VCC documentation](https://vcc.docs.vrchat.com/vpm/) for more information.

## How to list my packages?

To list your packages in the catalog, you need to submit your VPM repository URL.
Once your repository is listed, the catalog will automatically fetch the package list from your repository.

See the [registration form](https://docs.google.com/forms/d/e/1FAIpQLSc4nvnKJAbHkvygU-CT3Ms0viUm3dv_i_66R7c22tQSZ-f1Ow/viewform?usp=sf_link) to submit your repository.

## Why do my packages have fewer information?

The catalog fetches the package metadata from VPM repositories and fetches `README.md` file from the latest release zip files.
So if your repository does not have the metadata or `README.md` file, the catalog will show fewer information.

### Include README.md to your package zip file

`README.md` of your package's root folder will be used to create the catalog page.

### Fill recommended fields of package.json and repository json

Recommended fields are based on Unity Package Manager (UPM) format. You can provide the metadata in the `package.json` file and embed them to your repository json.
See the [Unity documentation](https://docs.unity3d.com/2022.3/Documentation/Manual/upm-manifestPkg.html) for more information.

Following `package.json` fields are recommended to be shown in the catalog page:

| Field | Description |
|---|---|
| `description` | A brief description of the package. |
| `displayName` | A user-friendly name to appear in the Unity Editor. |
| `unity` | Indicates the lowest Unity version the package is compatible with. |
| `author` | The author of the package. |
| `changelogUrl` | Custom location for this package’s changelog specified as a URL. |
| `documentationUrl` | Custom location for this package’s documentation specified as a URL. |
| `license` | Identifier for an OSS license using the [SPDX identifier format](https://spdx.org/licenses/), or a string such as "See LICENSE.md file". |
| `licenseUrl` | Custom location for this package’s license information specified as a URL. |

## How to remove my packages or repositories?

There are two options to remove your packages or repositories from the catalog.

### 1. Use `'vrc-get'.yanked` field in package metadata

`'vrc-get'.yanked` is defined by [vrc-get](https://vrc-get.anatawa12.com/en/cli/) and [ALCOM](https://vrc-get.anatawa12.com/en/alcom/) to hide discontinued packages.
VPM Catalog also hides packages when their `'vrc-get'.yanked` is a string or `true`.

```json
{
  "name": "com.example.package",
  "vrc-get": {
    "yanked": "This package is discontinued."
  }
}
```

### 2. Contact to the website author

- GitHub Repo: [kurotu/vpm-catalog](https://github.com/kurotu/vpm-catalog)
- X: [@kurotu](https://x.com/kurotu)
