import type { APIRoute } from "astro";
import { getAllPackages, type VPMPackageGroup, type VPMRepository } from "~/utils/vpm";

export const GET: APIRoute = async ({params, request}) => {
  const allRepos = await glob();
  const allPackages = getAllPackages(allRepos);
  const packages: Record<string, VPMPackageGroup> = {};
  for(const pkg of allPackages) {
    if (!packages[pkg.name]) {
      packages[pkg.name] = {
        versions: {}
      };
    }
    if (!packages[pkg.name].versions[pkg.version]
      || JSON.stringify(packages[pkg.name].versions[pkg.version]).length < JSON.stringify(pkg).length
     ) {
      packages[pkg.name].versions[pkg.version] = pkg;
    }
  }

  const data: VPMRepository = {
    name: "VPM Catalog",
    id: "com.github.kurotu.vpm-catalog",
    url: request.url,
    author: 'kurotu',
    packages,
  };
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  });
};

async function glob(): Promise<any[]> {
  const allImports = import.meta.glob("~/../vpm/repos/*.json", {eager: true});
  const results = (await Promise.all(Object.values(allImports)))
  return results.map((mod: any) => mod.default);
}
