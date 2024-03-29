# TODO (Move these todo items into GH issues)
* _(Priority: 1 - 10)_

## Current Branch Tasks/Changes
* Allow user to set timeout for auto-logout in settings [DONE]
* Fix jwt signature not being base64url (currently b64) [DONE]
* Rebuild wallet lock system. Lock while idle (not page change). Make sure every page click resets "lock" timer [DONE]
* Hash will always be listed in assets first, followed by Alphabetical order [DONE]
* Fix page wrapper for remove account page [DONE]
* Make sure mainnet accounts don't see Faucet in advanced settings (will always error out, testnet only) [DONE]
* Make sure when confirming seed phrase no duplicated values exist in selection rows [DONE]
* Switch all API calls to use RTK Query for caching
  - Statistics [DONE]
  - Assets [DONE]
  - Transactions [DONE]
* Make sure to force refetch dashboard API every 30s [DONE]
* Allow scrolling when wallet has a lot of accounts in dashboard menu [DONE]
* Update error loading message for dashboard assets [DONE]
* Send Complete page needs scroll container [DONE]
* Scroll for recent address list in send page [DONE]
* Make sure api fetch errors look correct, might be attempting to render object vs string [DONE]

## Features
* When wallet locks (while open) create a blurry lock screen indicating wallet lock mode [6]
  - Currently sucks to be using and not expecting a lock
  - Navigation should reset lock timeout (if it doesn't already)
  - Blur background, button to unlock page
* When wallet locks, remember previous location and return to it after re-logging back in. [7]
  - Annoying to have to navigate back to the previous page we were looking at
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
* Create better readme with instructions on how to initialize the local extension and redux dev tools [10]
* Profile menu to change wallet password [10]
  - Would need to unlock all master keys for all accounts and relock and save with new password
* Metrics/Logging [10]
  - Anon track errors, performance, etc.
