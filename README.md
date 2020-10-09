# Smartsheet GitHub Action: Update row

[![Maintainability](https://api.codeclimate.com/v1/badges/f957833986241b7b6339/maintainability)](https://codeclimate.com/github/paulholden2/smartsheet-update-row/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/f957833986241b7b6339/test_coverage)](https://codeclimate.com/github/paulholden2/smartsheet-update-row/test_coverage)

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
