# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Create tests to render pages and flows [IN_PROGRESS]
  - Takes too long to publish an app store update, can't deploy with bugs and fix them fast like websites.
  - Need to simulate flows to ensure everything renders properly.
* Random react errors when running locally [DONE]
* When running locally, create chrome spoof for storage functions [DONE]
* Update all app icons to be square [DONE]
  - Previously non-square rectangle causing stretched appearance
* Destroy wallet functionality not working [DONE]
* Update comment sniffer to find multiple comments in same file [DONE]
* Pull all API urls into separate consts file [DONE]
* Cleanup unused APIs [DONE]
* Move all api values out of env vars [DONE]
  - Determined by wallet network, not build type
* Run through and cleanup most TODO items [DONE]
  - App loading will take fullscreen (loading component prop) [DONE]
  - Remove ALL_URLS from consts and remove ability to redirect page (only redirect comes from background.js to notifications) [DONE]
  - User must click on text to copy, instead have user click anywhere on entire button row [DONE]
  - Move bumpWalletConnectTimeout to redux method (DRY) [DONE]
  - If the user closes newAccountName, we need to clear out the temp account information [DONE]
  - Needs to get tx fee Denom (currently hardcoded).  When ability to send other coins exists
    - Create new util to pull from api [DONE]
    - Update with wcjs tx [DONE]
    - Update with manual send from all [DONE]
      - Message slice

## Bugs
* If dApp disconnects while ext is signing message/approving tx currently goes to empty page [10]
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to close extension

## Features
* When user doesn't have a wallet created but does have the extension, no popup is triggered [3]
  - Instead open the popup and prompt the user to go through the account creation flow
    - This would only apply to initiating a walletconnect-init connection
    - Potentially just display a static page stating that the user needs to create an account/wallet before using a dApp with the extension
* All scrollable items should center scroll with blue scrollbar (vs page scrolling w/o scrollbar) [3]
* Change chrome icon when connected to a dApp [4]
  - chrome.action.setIcon({ path: "/example/path/image.png" })
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
