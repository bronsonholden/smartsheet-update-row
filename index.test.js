const run = require('.');
const core = require('@actions/core');

const mockUpdateRow = jest.fn();
const mockGetSheet = jest.fn();

jest.mock('@actions/core');
jest.mock('smartsheet', () => ({
  createClient: jest.fn(() => ({
    sheets: {
      getSheet: mockGetSheet,
      updateRow: mockUpdateRow
    }
  }))
}));

describe('Updates row in Smartsheet', () => {
  const columnId = 12345;
  const mockInputs = {
    'access-token': 'my-access-token',
    'sheet-id': 'my-sheet-id',
    'row-id': 'my-row-id',
    'column-name': 'my-column-name',
    'cell-value': 'my-cell-value'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    core.getInput = jest.fn(name => mockInputs[name]);

    mockGetSheet.mockImplementation(() => Promise.resolve({
      id: mockInputs['sheet-id'],
      columns: [
        {
          id: columnId,
          title: mockInputs['column-name']
        }
      ]
    }));

    mockUpdateRow.mockImplementation(() => Promise.resolve({}));
  });

  test('retrieves the sheet', async () => {
    await run();
    expect(mockGetSheet).toHaveBeenCalledTimes(1);
    expect(mockGetSheet).toHaveBeenCalledWith({
      id: mockInputs['sheet-id']
    });
    expect(core.setFailed).toHaveBeenCalledTimes(0);
  });

  test('missing sheet', async () => {
    mockGetSheet.mockImplementation(() => Promise.reject('Mocked missing sheet'));
    await run();
    expect(mockGetSheet).toHaveBeenCalledTimes(1);
    expect(mockUpdateRow).toHaveBeenCalledTimes(0);
    expect(core.setFailed).toHaveBeenCalledTimes(1);
  });

  test('missing column', async () => {
    mockGetSheet.mockImplementation(() => Promise.resolve({
      id: mockInputs['sheet-id'],
      columns: [{
        id: columnId,
        title: `not-${mockInputs['column-name']}`
      }]
    }));

    await run();
    expect(mockGetSheet).toHaveBeenCalledTimes(1);
    expect(mockUpdateRow).toHaveBeenCalledTimes(0);
    expect(core.setFailed).toHaveBeenCalledTimes(1);
  });

  test('updates the cell value', async () => {
    await run();
    expect(mockUpdateRow).toHaveBeenCalledTimes(1);
    expect(mockUpdateRow).toHaveBeenCalledWith({
      sheetId: mockInputs['sheet-id'],
      body: [{
        id: mockInputs['row-id'],
        cells: [ { columnId, value: mockInputs['cell-value'] } ]
      }]
    });
    expect(core.setFailed).toHaveBeenCalledTimes(0);
  });
});
