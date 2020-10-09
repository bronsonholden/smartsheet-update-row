const core = require('@actions/core');
const github = require('@actions/github');
const Smartsheet = require('smartsheet');

async function getColumnId(smartsheet, sheetId, columnName) {
  const response = await smartsheet.sheets.getSheet({
    id: sheetId
  });

  console.log(response);

  const columns = response.columns;

  for (let i = 0; i < columns.length; ++i) {
    const col = columns[i];

    if (col.title === columnName) {
      return Promise.resolve(col.id);
    }
  }

  return Promise.reject(`Unable to locate a column titled '${columnName}' in your sheet`);
}

async function run() {
  try {
    const accessToken = core.getInput('access-token');
    const sheetId = core.getInput('sheet-id');
    const rowId = core.getInput('row-id');
    const columnName = core.getInput('column-name');
    const cellValue = core.getInput('cell-value');
    const smartsheet = Smartsheet.createClient({
      accessToken
    });

    // Retrieve the column ID
    const columnId = await getColumnId(smartsheet, sheetId, columnName);

    const response = await smartsheet.sheets.updateRow({
      sheetId,
      body: [{
        id: rowId,
        cells: [ { columnId, value: cellValue } ]
      }]
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;

// istanbul ignore next
if (require.main === module) {
  run();
}
