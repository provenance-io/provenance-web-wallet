# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Whenever we fail to get gas estimate display error (same error as an invalid address) [DONE]
  - When adding marker and we send through a duplicated marker
  - When using an invalid address
  - Just display the error and reject the tx.
* Use updated recent transactions api to show recent tx addresses on send [DONE]
* Finish building out Transactions Page [DONE]
* Build out transaction details page (when you click a single tx row) [IN_PROGRESS]

## Bugs
* If dApp disconnects while ext is signing message/approving tx currently goes to empty page [10]
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to close extension
* Wallet-utils not correctly converting numbers to strings (example: permissionsList) [0_3RD_PARTY]
  - This will need to be fixed within wallet-utils, not here in web-wallet.

## Features
* Handle blockchain broadcast failures & display reasons (instead of success page) [2]
* When a tx message (walletconnect-js) comes through, auto switch to the target wallet (maybe...ask JD) [2]
  - Should already be connected to wcjs which is connected to a wallet, active wallet shouldn't matter
  - Make sure sign msg and send tx don't pull anything from "active wallet"
* Batch action/message (single sign for paginated list of things to take action on) [3]
* Create txSend complete success page [4]
* When connecting into a dApp, user should be able to select target account to connect (and set active) [4]
  - In dashboard menu indicate which account is currently connected to dApp
  - If switching active account, disconnect from dApp (maybe)
* Allow pressing "enter" on an input to automatically submit (accessability) [4]
  - Will need additional accessability features (tab index, titles, etc)
* When user doesn't have a wallet created but does have the extension, no popup is triggered [5]
  - Instead open the popup and prompt the user to go through the account creation flow
    - This would only apply to initiating a walletconnect-init connection
    - Potentially just display a static page stating that the user needs to create an account/wallet before using a dApp with the extension
* General styling updates - lots of pages need a once over to match designs and asthetic [6]
* Dashboard menu - child accounts indented (tree) [7]
* Create an address book with account names [7]
  - Any time we render an address check for existing contact in address book
* Create more typography components, try not to have any styled components by pulling out to shared versions [7]
  - Use Figma to match typography names for even fast development
* Instead of "Please Wait" messages, show a full page spinning loader (can later add additional text) [7]
* Notify the user when they are creating a duplicate account (check HD path, if it already exists in accounts don't let them create the account) [8]
* Second child (sub) account should automatically up the accountIndex from the next highest value [8]
* Allow for yarn start to use chrome spoof commands [9]
* Advanced settings - "reset defaults" button for mainnet / testnet [10]
  - Not sure what this todo list item is...
* Allow user to set timeout for auto-logout in settings [10]
* Create better readme with instructions on how to initialize the local extension and redux dev tools [10]
* Profile menu to change wallet password [10]
  - Would need to unlock all master keys for all accounts and relock and save with new password
* Auto check mnuemonic input fields as they are entered (make sure valid word) [10]
* Secret testnet/dev menu [10]
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging [10]
  - Anon track errors, performance, etc.
* Account Address book [10]

## Cleanup
* Clean up chain.ts util file, make a chain folder and split out the actions into separate files, too messy currently [10]
* Walletconnect-js doesn't need to handle extensionId anymore due to content-script [0_3RD_PARTY]
