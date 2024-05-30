import { SemVer } from "semver";

export interface VPMRepository {
  name: string,
  id?: string,
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
  // vrc-get extension for yank support
  'vrc-get'? : { yanked?: boolean | string; }
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
  unityRelease?: string,
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

export const isYanked = (pkg: VPMPackage) => {
  const yank = pkg['vrc-get']?.['yanked'];
  const yanked = typeof yank === 'string' || yank === true;
  return yanked;
}

/**
 * Return the latest release package. If there are no release packages, return the latest package.
 * @param packages
 * @returns
 */
export const findLatestReleasePackage = (packages: VPMPackage[]) => {
  const publishingPackages = packages.filter(p => !isYanked(p));
  const releasePackages = publishingPackages.filter(p => !p.version.includes('-'));
  const latestStable = findLatestPackage(releasePackages);
  if (latestStable) {
    return latestStable;
  }
  return findLatestPackage(publishingPackages);
}

export const getPackages = (group: VPMPackageGroup) => {
  return Object.values(group.versions)
    .filter(p => !isYanked(p))
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

export const getDeprecatorPackages = (pkg: VPMPackage, repositories: VPMRepository[]) => {
  const allReleasePackages = repositories
    .flatMap(r => Object.values(r.packages))
    .map(group => findLatestReleasePackage(Object.values(group.versions)))
  return allReleasePackages
    .filter((p): p is VPMPackage => p ? true : false)
    .filter(p => p?.legacyPackages?.includes(pkg.name) ?? false);
}

export const vccAddRepoLink = (url: string) => {
  return `vcc://vpm/addRepo?url=${url}`;
}

export const idToFileName = (id: string) => {
  if (id.match(/^https?:\/\//)) {
    return urlToFileName(id);
  }
  return id;
}

const urlToFileName = (url: string) => {
  return url.replaceAll('://', '_').replaceAll('/', '_');
}
