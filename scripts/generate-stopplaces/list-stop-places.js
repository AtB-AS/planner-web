const { getAll } = require('./data-layer');

module.exports.listStopPlaces = async function listStopPlaces(authorityPrefix) {
  const data = await getAll();
  const ids = data
    .filter(isValid)
    .filter(createAuthorityPredicate(authorityPrefix))
    .map((i) => i.id);

  return ids;
};

function isValid(item) {
  if (!item.validBetween) {
    // assume it is invalid if no validBetween is defined
    return false;
  }
  const to = item.validBetween[1];

  // To is not defined. meaning it is still valid
  if (!to) {
    return true;
  }

  return false;
}
function createAuthorityPredicate(authorityPrefix) {
  return function isOfAuthority(item) {
    return item.zones.some((zone) =>
      zone.toLowerCase().startsWith(authorityPrefix.toLowerCase()),
    );
  };
}
