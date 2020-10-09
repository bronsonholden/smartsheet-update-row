const core = require('@actions/core');
const github = require('@actions/github');
const Smartsheet = require('smartsheet');

async function getColumn(smartsheet, sheetId, columnName) {
  const response = await smartsheet.sheets.getSheet({
    id: sheetId
  });

  const columns = response.columns;

  for (let i = 0; i < columns.length; ++i) {
    const col = columns[i];

    if (col.title === columnName) {
      return Promise.resolve(col);
    }
  }

  return Promise.reject(`Unable to locate a column titled '${columnName}' in your sheet`);
}

function serializeValue(cellValue, columnType) {
  switch (columnType) {
    case 'DATE':
    case 'DATETIME':
      return new Date(cellValue);
    default:
      return cellValue;
  }
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
    const column = await getColumn(smartsheet, sheetId, columnName);
    const columnId = column.id;

    const response = await smartsheet.sheets.updateRow({
      sheetId,
      body: [{
        id: rowId,
        cells: [{ columnId, value: serializeValue(cellValue, column.type) }]
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
