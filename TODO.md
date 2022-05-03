# TODO
## To do shortlist

### Wallet Connect / dApps
* When connecting into a dApp, user should be able to select target account to connect (and set active)
* Determine if we want to require password before allowing a connection into dApp
* Correctly form/create JWT when connecting with wallet connect

### General
* Keep user logged in (no password/unlock required) until browser closed or timeout reached
* Create logout button
* In settings, allow user to set timeout for auto-logout

### Accounts
* Automatically switch API urls based on current active wallet.  TP will go to test urls, PB will go to prod urls
* When creating the first account, the name will be for the Wallet.  Wallet => Seed
* Split accounts by wallet name in dashboard menu
* Allow importing new wallets and display in dashboard menu (under new wallet names)

### App
* Update/Finish transactions page
* Update all settings, get them to function correctly
* Ability to reset/remove all wallets (Are we sure we want this functionality?)
* Handle signing requests
* Ability so Send/Receive from the dashboard page

### Extra
* Secret dev menu?
  - Log saved variables
  - Auto Faucet to add hash to tp address
* Metrics/Logging
  - Track errors, performance, etc.