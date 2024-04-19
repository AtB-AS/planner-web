const { getAll, CACHE_FILE } = require('./data-layer');
const fs = require('fs/promises');

main();
async function main() {
  try {
    console.log('Deleting cache file');
    await fs.unlink(CACHE_FILE);
  } catch (e) {
    console.error('Unable to delete cache file');
  }

  const data = await getAll();
  console.log(`Generated and cached ${data.length} stop places`);
}
