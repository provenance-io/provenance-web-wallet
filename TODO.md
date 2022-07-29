# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Recover Account endless spin after adding name [DONE]
* Allow pressing "enter" on all inputs to automatically submit (accessability) [DONE]
* Add a significant amount of accessability controls on all pages [DONE]
* Build production code with no minification and no obfuscation [3]
  - This won't effect production times as the user downloads the entire repo into chrome from the webstore
  - This should (in theory and chrome documentation) speed up the app approval process and times
* Timeout on clicking homepage slider [DONE]
  - Spamming can cause it to bug out
  - Set a timeout for the animation length

## Bugs
* If dApp disconnects while ext is signing message/approving tx currently goes to empty page [10]
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to close extension

## Features
* Run through and cleanup all TODO: items [3]
* Create tests to render pages and flows [3]
  - Will require spoofing chrome storage and chrome functions (tests will run outside of chrome env)
  - Takes too long to publish an app store update, can't deploy with bugs and fix them fast like websites.
  - Need to simulate flows to ensure everything renders properly.
* Change chrome icon when connected to a dApp [4]
  - chrome.action.setIcon({ path: "/example/path/image.png" })
* When user doesn't have a wallet created but does have the extension, no popup is triggered [5]
  - Instead open the popup and prompt the user to go through the account creation flow
    - This would only apply to initiating a walletconnect-init connection
    - Potentially just display a static page stating that the user needs to create an account/wallet before using a dApp with the extension
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

## Cleanup
* Clean up chain.ts util file, make a chain folder and split out the actions into separate files, too messy currently [10]
* Walletconnect-js doesn't need to handle extensionId anymore due to content-script [0_3RD_PARTY]
