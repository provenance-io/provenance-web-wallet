# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Create new const variable to hold the current app version (set with npm run versionUp) [DONE]
  - Used by profile page to display wallet version
* New package command to auto zip and name the build folder to submit to chrome web store [DONE]

## Features
* Potential security check to make sure this is the correct wallet app from wcjs [1]
  - Check chrome extension ID's to make sure they match
  - This ID is `pfcpdmimlaffecihgamfbnfffmdlhkmh`
  - Prevent copycat app in extension store from stealing account after signing into dApp.
* Create cleaner/better chrome store images, videos, and other marketing information [3]
* All scrollable items should center scroll with blue scrollbar (vs page scrolling w/o scrollbar) [3]
* Dashboard menu - child accounts indented (tree) [7]
* Check all accessability items [7]
  - Make sure all tabs and keyboard events work
  - Be able to navigate entire app without a mouse
* Create an address book with account names [7]
  - Any time we render an address check for existing contact in address book
* Replace all inline-infile styled typography components with the Typo component [7]
  - Use Figma to match typography names for even faster development
* Notify the user when they are creating a duplicate account (check HD path, if it already exists in accounts don't let them create the account) [8]
* Second child (sub) account should automatically up the accountIndex from the next highest value [8]
* Allow user to set timeout for auto-logout in settings [10]
* Create better readme with instructions on how to initialize the local extension and redux dev tools [10]
* Profile menu to change wallet password [10]
  - Would need to unlock all master keys for all accounts and relock and save with new password
* Secret testnet/dev menu [10]
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging [10]
  - Anon track errors, performance, etc.
