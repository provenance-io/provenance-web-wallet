# TODO
## To do shortlist

## Current Branch Tasks
* Handle walletconnect-js messages
  - Broadcast transaction/sendHash [IN_PROGRESS]
  - Sign message [DONE]
  - Sign JWT (Just a "signMessage") [DONE]
  - Custom Actions
    - Send Hash
    - Create Marker
    - Destroy Marker
    - Approve Marker

## Near-Future™ Branch Tasks
* Wallet-utils not correctly converting numbers to strings (example: permissionsList)
* If dApp disconnects while a user is signing a message, auto reject on ext if possible
  - Change the page, say "You've been disconnected" and just allow pressing "ok" to leave
* Handle blockchain broadcast failures & display reasons (instead of success page)
* Batch action/message (single sign for paginated list of things to take action on)
* Dashboard menu - child accounts indented (tree)
* Advanced settings - "reset defaults" button for mainnet / testnet
* Notify the user when they are creating a duplicate account (check HD path, if it already exists in accounts don't let them create the account)
* Second child (sub) account should automatically up the accountIndex from the next highest value

### Bugs
* Sometimes extension shows pending action when there is none
  - At very least, if there is none, when opened, remove pending notice from ext icon
* Random error after/during unlock 'Error: Missing or invalid topic field'
  - Unlock works, wallet exists, no other visible issues
* dApp connection request takes two clicks to cause popup to open 
  - Look into the setting of localStorage, value changes, no popup, on second click, value exists, popup opens
* dApp request message sign and no popup is triggered from background.js
  - Doesn't always happen, hard to recreate
  - Seems to happen less and less with code refactoring, see if others report same issue or remove
  - Connect and then instantly go to sign message in demo, most of the time triggers this bug

### Missing Core Functionality
* Sign for transactions/send hash

### Wallet Connect / dApp Enhancements
* When connecting into a dApp, user should be able to select target account to connect (and set active)
  - In dashboard menu indicate which account is currently connected to dApp
  - If switching active account, disconnect from dApp (maybe)

### Settings
* Allow user to set timeout for auto-logout
* Allow removing all wallets/clearing out account
  - Require them to type ~"Remove all Data"

### General
* Create better readme with instructions on how to initialize the local extension and redux dev tools
* Allow for yarn start to use chrome spoof commands
* Profile menu to change wallet password
  - Would need to unlock all master keys for all accounts and relock and save with new password
* Add fading background to floating buttons so user can see there is content to scroll down for
  - Maybe build a custom scrollbar that doesn't stand out as much as a normal white version
* General styling updates - lots of pages need a once over to match designs and asthetic
* Create more typography components, try not to have any styled components by pulling out to shared versions
* Auto check mnuemonic input fields as they are entered (make sure valid word)
* Instead of "Please Wait" messages, show a full page spinning loader (can later add additional text)
* Allow pressing "enter" on an input to automatically submit (accessability)
  - Will need additional accessability features (tab index, titles, etc)
* When user doesn't have a wallet created but does have the extension, no popup is triggered
  - Instead open the popup and prompt the user to go through the account creation flow
    - This would only apply to initiating a walletconnect-init connection
    - Potentially just display a static page stating that the user needs to create an account/wallet before using a dApp with the extension

### Accounts
* Automatically switch API urls based on current active wallet.  TP will go to test urls, PB will go to prod urls

### Extra
* Secret dev menu?
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging
  - Anon track errors, performance, etc.