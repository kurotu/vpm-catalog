import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Image } from 'mdast';

import { copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dummyFile = 'vpm-catalog-dummy.png';
const __dirname = dirname(fileURLToPath(import.meta.url));
const dummyPath = join(__dirname, dummyFile);

const customRemarkPlugin: Plugin = () => {
  console.log(dummyPath);
  return (tree, file) => {
    if (file.basename === 'README.md') {
      visit(tree, 'image', (node: Image) => {
        if (!node.url.startsWith('http')) {
          const imagePath = join(file.dirname!, node.url);
          if (!existsSync(imagePath)) {
            copyFileSync(dummyPath, join(file.dirname!, dummyFile));
            node.url = `./${dummyFile}`;
          }
        }
      });
    }
  };
};

export default customRemarkPlugin;
