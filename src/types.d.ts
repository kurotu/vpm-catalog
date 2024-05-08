export interface VPMRepository {
  name: string,
  id: string,
  author: string,
  url: string,
  packages: {[key: string]: VPMPackageGroup},
}

export interface VPMPackageGroup {
  versions: {[key: string]: VPMPackage},
}

export interface VPMPackage extends UPMPackage {
  vpmDependencies: {[key: string]: string}?,
  url: string,
  legacyFolders: {[key: string]: string}?,
  legacyFiles: {[key: string]: string}?,
  legacyPackages: string[]?,
}

export interface UPMPackage {
  name: string,
  version: string,
  description: string,
  displayName: string,
  unity: string,
  author: People?,
  changelogUrl: string?,
  dependencies: {[key: string]: string}?,
  documentationUrl: string?,
  hideInEditor: boolean?,
  keywords: string[]?,
  license: string?,
  licensesUrl: string?,
}

export interface People {
  name: string,
  email: string?,
  url: string?,
}
