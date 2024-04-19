const fs = require('fs/promises');
const { join } = require('path');

const STOP_PLACE_URL = 'https://api.entur.io/stop-places/v1/read/stop-places';
const MAX_NUMBERS_FOR_ITERATIONS = 1000;

const CACHE_FILE = join(__dirname, 'stop-places.json');
module.exports.CACHE_FILE = CACHE_FILE;

module.exports.getAll = async function getAll() {
  try {
    const cache = await fs.readFile(CACHE_FILE);
    return JSON.parse(cache);
  } catch (e) {
    console.log('No cache file found, fetching all stop places');
  }

  const data = await listAllStopPlaces([]);
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
  return data;
};

async function listAllStopPlaces(arr = [], skip = 0) {
  console.log(`Fetching from skip ${skip} (total ${arr.length})`);
  const result = await fetch(
    `${STOP_PLACE_URL}?count=${MAX_NUMBERS_FOR_ITERATIONS}&skip=${skip}`,
  );
  if (!result.ok) {
    const error = await result.json();
    throw new Error('Unable to fetch data', error);
  }
  const data = await result.json();

  if (data.length < MAX_NUMBERS_FOR_ITERATIONS) {
    return arr;
  } else {
    await delay();
    return listAllStopPlaces(
      arr.concat(
        data.map((stopPlace) => ({
          id: stopPlace.id,
          public: stopPlace.publication === 'PUBLIC',
          validBetween: stopPlace.validBetween?.[0]
            ? [
                stopPlace.validBetween?.[0]?.fromDate,
                stopPlace.validBetween?.[0]?.toDate,
              ]
            : [],
          zones:
            stopPlace.tariffZones?.tariffZoneRef?.map((zone) => zone.ref) ?? [],
        })),
      ),
      skip + data.length,
    );
  }
}

function delay(time = 500) {
  return new Promise((resolve) => setTimeout(resolve, 500));
}
