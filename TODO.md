# TODO
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Add "backCallback" to header component to run on click (before navigating) [DONE]
* When leaving send flow back to dashboard, reset/clear out coin redux store data. [DONE]
* If invalid address/unable to get gas-estimate, display an error on the next page (gas fee is required) [DONE]
  - In "send" flow, validate the address entered
* Move notification page redirect into App.tsx instead of RequiresAuth.tsx
* Occationally/rarely, when clicking to connect or an action, popup opens with no content [DONE*]
  - Hard to recreate, loads basic popup with no content (just a page background)
* dApp connection request takes two clicks to cause popup to open [DONE*]
  - Sometimes, not always, hard to debug/reproduce
  - "Error: Could not establish connection. Receiving end does not exist." (first click)
  - Look into the setting of localStorage, value changes, no popup, on second click, value exists, popup opens
  - Potentially a walletconnect-js issue
* Random error after/during unlock 'Error: Missing or invalid topic field' [IN_PROGRESS]
  - Unlock works, wallet exists, no other visible issues

## Bugs
* Whenever we fail to get gas estimate display error (same error as an invalid address) [1]
  - When adding marker and we send through a duplicated marker
  - When using an invalid address
  - Just display the error and reject the tx.
* Wallet-utils not correctly converting numbers to strings (example: permissionsList) [2]
  - This will need to be fixed within wallet-utils, not here in web-wallet.
* Unable to reject pending tx if connection is dead (should auto reject somehow if disconnected) [3]
* If dApp disconnects while a user is signing a message, auto reject on ext if possible [3]
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to leave
* If you select extension in the popup, then close the extension, dApp still things the current connection type is "extension" [3]
  - If you connect with mobile, on action, both mobile and extension receive the request
  - If the tab changes, reset the extension type (if not connected)
* Sometimes extension shows pending action when there is none [3]
  - At very least, if there is none, when opened, remove pending notice from ext icon

## Features
* Popup should use custom html page (instead of using index and getting js-redirected) [1]
  - Causes extra rendering and a flash of new content when a popup notification is opened
* Use updated recent transactions api to show recent tx addresses on send [1]
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

## Cleanup
* Clean up chain.ts util file, make a chain folder and split out the actions into separate files, too messy currently [10]
