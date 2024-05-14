import { SemVer } from 'semver';
import { createInterface } from 'readline';

const reader = createInterface({
  input: process.stdin,
});

const lines = [];

reader.on('line', (line) => {
  lines.push(line);
});

reader.on('close', () => {
  const versions = lines.map((line) => new SemVer(line));
  versions.sort((a, b) => a.compare(b));
  versions.forEach((version) => console.log(version.toString()));
});
