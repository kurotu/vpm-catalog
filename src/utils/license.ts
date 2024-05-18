export interface LicenseList {
  licenses: LicenseListItem[],
}

export interface LicenseListItem {
  reference: string,
  licenseId: string,
}

export const fetchLicenseData = async (url: string = 'https://github.com/spdx/license-list-data/raw/main/json/licenses.json') => {
  const response = await fetch(url);
  const data = await response.json();
  return data as LicenseList;
}

export const findLicense = (licenseId: string, licenses: LicenseList) => {
  return licenses.licenses.find(l => l.licenseId === licenseId);
}
