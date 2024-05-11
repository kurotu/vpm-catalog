import { SemVer } from "semver";

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
  vpmDependencies: { [key: string]: string; } | undefined,
  url: string,
  legacyFolders: { [key: string]: string; } | undefined,
  legacyFiles: { [key: string]: string; } | undefined,
  legacyPackages: string[] | undefined,
}

export interface UPMPackage {
  name: string,
  version: string,
  description: string,
  displayName: string,
  unity: string,
  author: People | undefined,
  changelogUrl: string | undefined,
  dependencies: { [key: string]: string; } | undefined,
  documentationUrl: string | undefined,
  hideInEditor: boolean | undefined,
  keywords: string[] | undefined,
  license: string | undefined,
  licensesUrl: string | undefined,
}

export interface People {
  name: string,
  email: string | undefined,
  url: string | undefined,
}

export const getAllPackages = (repositories: VPMRepository[]) => {
  return repositories
    .flatMap(r => Object.values(r.packages))
    .flatMap(group => getPackages(group));
}

export const findLatestReleasePackage = (group: VPMPackageGroup) => {
  const packages = getPackages(group).filter(p => !p.version.includes('-'));
  return findLatestPackage(packages);
}

export const getPackages = (group: VPMPackageGroup) => {
  return Object.values(group.versions);
}

export const findLatestPackage = (packages: VPMPackage[]) => {
  if (packages.length === 0) {
    return undefined;
  }
  const sorted = packages.sort((a, b) => {
    const aVersion = new SemVer(a.version);
    const bVersion = new SemVer(b.version);
    return aVersion.compare(bVersion);
  });
  return sorted[packages.length - 1];
}

export const vccAddRepoLink = (url: string) => {
  return `vcc://vpm/addRepo?url=${url}`;
}
