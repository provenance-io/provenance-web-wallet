# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* All scrollable items should center scroll with blue scrollbar (vs page scrolling w/o scrollbar) [DONE]
  - Verify seedPhrase [DONE]
  - SeedPhrase New Account List [DONE]
  - Advanced Settings [DONE]
  - Transactions [DONE]
  - Dashboard Assets [DONE]
  - Create new scroll container component for scrolling items [DONE]
* Add catch for asset details page fetch [DONE]

## Features
* Dashboard menu [7]
  - Child accounts indented (tree)
  - Accounts should have details option (HD path, network, publicKey, etc listed)
* Check all accessability items [7]
  - Make sure all tabs and keyboard events work
  - Be able to navigate entire app without a mouse
* Create an address book with account names [7]
  - Any time we render an address check for existing contact in address book
* Notify the user when they are creating a duplicate account (check HD path, if it already exists in accounts don't let them create the account) [8]
* Second child (sub) account should automatically up the accountIndex from the next highest value [8]
* Potential security check to make sure this is the correct wallet app from wcjs [10]
  - Set as priority 10 as this is a user error
  - Check chrome extension ID's to make sure they match
  - This ID is `pfcpdmimlaffecihgamfbnfffmdlhkmh`
  - Prevent copycat app in extension store from stealing account after signing into dApp.
* Allow user to set timeout for auto-logout in settings [10]
* Create better readme with instructions on how to initialize the local extension and redux dev tools [10]
* Profile menu to change wallet password [10]
  - Would need to unlock all master keys for all accounts and relock and save with new password
* Metrics/Logging [10]
  - Anon track errors, performance, etc.
