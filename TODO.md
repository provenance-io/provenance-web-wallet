# TODO
## To do shortlist

### Bugs
* dApp request message sign and no popup is triggered from background.js
  - Doesn't always happen, hard to recreate

### Wallet Functionality
* Sign for transactions

### Wallet Connect / dApps
* When connecting into a dApp, user should be able to select target account to connect (and set active)
* Correctly form/create JWT when connecting with wallet connect (just dummy data right now)

### General
* In settings, allow user to set timeout for auto-logout
* Success page (typically used after a Notification)
  - After connecting to a dApp say "success" instead of just closing
* Auto check mnuemonic input fields as they are entered (make sure valid word)
* Generic success page/message
  - After creating an account or performing specific actions (vs just redirecting back to the landing page)
* Instead of "Please Wait" messages, show a full page spinning loader (can later add additional text)
* Allow pressing "enter" on an input to automatically submit (accessability)
* Need testing built into app (all the flows: create, recovery, etc)
* Clean up account creation, recovery, and addition function, all use the same code and are excessive.  Create more helper functions, especially for advanced options.

### Accounts
* Automatically switch API urls based on current active wallet.  TP will go to test urls, PB will go to prod urls
* When creating the first account, the name will be for the Wallet.  Wallet => Seed
* Split accounts by wallet name in dashboard menu
* Allow importing new wallets and display in dashboard menu (under new wallet names)

### App
* Update/Finish transactions page
* Update all settings, get them to function correctly
* Ability to reset/remove all wallets (Are we sure we want this functionality?)
* Ability so Send/Receive from the dashboard page

### Extra
* Secret dev menu?
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging
  - Track errors, performance, etc.