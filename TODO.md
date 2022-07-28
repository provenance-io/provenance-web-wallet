# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Tx details rows, add administrator as trim address type [DONE]
* Create txSend complete success page [DONE]
  - Create loading icon as TX is processing [DONE]
    - Create new "overlay" loading option (block everything out) [DONE]
    - Since changing from SYNC to BLOCK it's significantly slower (gets more data back) [DONE]
  - Transaction details should show special display properties (after tx and looking at tx history) [DONE]
    - txHash should have a link to view the tx on explorer (note test vs mainnet) [DONE]
  - Format tx success page to look similar to send success page [DONE]
* Tx details needs a list of properties to show (currently shows too much crap) [DONE]
  - Detect type of tx and load the keys we want to display [DONE]

## Bugs
* If dApp disconnects while ext is signing message/approving tx currently goes to empty page [10]
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to close extension

## Features
* Handle blockchain broadcast failures & display reasons (instead of success page) [2]
* Run through and cleanup all TODO: items [3]
* Change chrome icon when connected to a dApp [3]
  - chrome.action.setIcon({ path: "/example/path/image.png" })
* Allow pressing "enter" on an input to automatically submit (accessability) [4]
  - Will need additional accessability features (tab index, titles, etc)
* When user doesn't have a wallet created but does have the extension, no popup is triggered [5]
  - Instead open the popup and prompt the user to go through the account creation flow
    - This would only apply to initiating a walletconnect-init connection
    - Potentially just display a static page stating that the user needs to create an account/wallet before using a dApp with the extension
* Dashboard menu - child accounts indented (tree) [7]
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

## Cleanup
* Clean up chain.ts util file, make a chain folder and split out the actions into separate files, too messy currently [10]
* Walletconnect-js doesn't need to handle extensionId anymore due to content-script [0_3RD_PARTY]
