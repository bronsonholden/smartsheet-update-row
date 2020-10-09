# Smartsheet GitHub Action: Update row

A GitHub action that updates a single row in Smartsheet. Use in conjunction
with `smartsheet-add-row` in a workflow to add rows with data to your sheets.

## Inputs

| Input name | Description |
|------------|-------------|
| access-token | Your Smartsheet API access token |
| sheet-id | The sheet ID your row exists in |
| row-id | The row ID to update |
| column-name | Title of the column you wish to update a row value for |
| cell-value | The value to enter into your row |

## Outputs

None.
