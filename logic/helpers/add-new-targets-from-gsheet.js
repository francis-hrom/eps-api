const addTarget = require('./add-target');
const getAllTargets = require('./get-all-targets');
const getTargetsFromGsheet = require('./get-targets-from-gsheet');

module.exports = async () => {
  const targetsGsheet = await getTargetsFromGsheet();
  const targetsDb = await getAllTargets();

  const newTargets = targetsGsheet.filter(
    ({ url: url1 }) => !targetsDb.some(({ url: url2 }) => url2 === url1)
  );

  const newTargetsLength = newTargets.length;
  console.log(`New target(s) found in gsheet: ${newTargetsLength}`);

  if (newTargetsLength > 0) {
    await Promise.all(
      newTargets.map(
        async (target) => await addTarget(target.url, target.selector)
      )
    );
    console.log(`Added ${newTargetsLength} new target(s).`);
  }
};
