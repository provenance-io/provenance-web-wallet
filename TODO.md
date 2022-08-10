# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Paste Mnemonic needs to work with all sorts of crazy values [DONE]
  - Create tests
* Switching accounts should be faster [DONE]
  - Three dots, click account, auto switch/close
  - Three dots, three dots, account settings

## Bugs
* If dApp disconnects while ext is signing message/approving tx currently goes to empty page [10]
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to close extension

## Features
* All scrollable items should center scroll with blue scrollbar (vs page scrolling w/o scrollbar) [3]
* Dashboard menu - child accounts indented (tree) [7]
* Check all accessability items [7]
  - Make sure all tabs and keyboard events work
  - Be able to navigate entire app without a mouse
* Create an address book with account names [7]
  - Any time we render an address check for existing contact in address book
* Replace all inline-infile styled typography components with the Typo component [7]
  - Use Figma to match typography names for even faster development
* Instead of "Please Wait" messages, show a full page spinning loader (can later add additional text) [7]
* Notify the user when they are creating a duplicate account (check HD path, if it already exists in accounts don't let them create the account) [8]
* Second child (sub) account should automatically up the accountIndex from the next highest value [8]
* Allow user to set timeout for auto-logout in settings [10]
* Create better readme with instructions on how to initialize the local extension and redux dev tools [10]
* Profile menu to change wallet password [10]
  - Would need to unlock all master keys for all accounts and relock and save with new password
* Auto check mnuemonic input fields as they are entered (make sure valid word) [10]
* Allow for yarn start to use chrome spoof commands [10]
* Secret testnet/dev menu [10]
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging [10]
  - Anon track errors, performance, etc.
