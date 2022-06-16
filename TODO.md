# TODO
## To do shortlist

### Current branch todos
* Finish Add Account [ACTIVE]
  - When this account tries to create an additional account, it must be lower in the HD path
    - Other fields in the HD path will need to be grey'd out (non changable)
* New Account flow needs custom "Process" amount since each flowType (add, create, recover) has a different amount of steps
  - This process amount will be set in the routes
  - Process lives in the Header component
* Fix buttons on dashboard
* Create error message component (not alert)
  - Continuously remaking the same component in app
* Remove unused code and functions (mainly from chain.ts)
* Fix scroll bars in notification popup (window.create())

### Bugs
* dApp connection request takes two clicks to cause popup to open 
  - Look into the setting of localStorage, value changes, no popup, on second click, value exists, popup opens
* dApp request message sign and no popup is triggered from background.js
  - Doesn't always happen, hard to recreate

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
* General styling updates - lots of pages need a once over to match designs and asthetic
* Create more typography components, try not to have any styled components by pulling out to shared versions
* Auto check mnuemonic input fields as they are entered (make sure valid word)
* Instead of "Please Wait" messages, show a full page spinning loader (can later add additional text)
* Allow pressing "enter" on an input to automatically submit (accessability)
  - Will need additional accessability features (tab index, titles, etc)
* Need testing built into app (all the flows: create, recovery, etc)
* Ability to remove wallet from dashboard menu (only allowed if 2+ wallets exist)

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