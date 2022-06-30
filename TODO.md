# TODO
## To do shortlist

## Current Branch Tasks

## Near-Future™ Branch Tasks
* - Unlock page nuke option (to see create account again or auto start create account)
* - Dashboard menu - child accounts indented (tree)
* - Advanced settings - "reset defaults" button for mainnet / testnet
* - Notify the user when they are creating a duplicate account (check HD path, if it already exists in accounts don't let them create the account)

### Bugs
* Random error after/during unlock 'Error: Missing or invalid topic field'
  - Unlock works, wallet exists, no other visible issues
* dApp connection request takes two clicks to cause popup to open 
  - Look into the setting of localStorage, value changes, no popup, on second click, value exists, popup opens
* dApp request message sign and no popup is triggered from background.js
  - Doesn't always happen, hard to recreate
  - Seems to happen less and less with code refactoring, see if others report same issue or remove

### Missing Core Functionality
* Sign for transactions/send hash

### Wallet Connect / dApp Enhancements
* When connecting into a dApp, user should be able to select target account to connect (and set active)
* Correctly form/create JWT when connecting with wallet connect (just dummy data right now)

### Settings
* Allow user to set timeout for auto-logout
* Allow removing all wallets/clearing out account
  - Require them to type ~"Remove all Data"

### General
* Add fading background to floating buttons so user can see there is content to scroll down for
  - Alternatly, allow build a custom scrollbar that doesn't stand out as much as a normal white version
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
* Allow importing new wallets and display in dashboard menu (under new wallet names)
  - Split accounts by wallet in dashboard menu

### Extra
* Secret dev menu?
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging
  - Anon track errors, performance, etc.