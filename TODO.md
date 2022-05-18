# TODO
## To do shortlist

### Bugs
* [IN_PROGRESS] Walletconnect session should expire in 30 mins of inactivity
  - Timers created, need to 'bump' exp time whenever interacting with dApp.
* Allow notifications without "unlocking".  "Unlock" should only be when manually opening the extension and seeing balances.
  - We have to authenticate before we are allowed to sign or connect anyway, so this prevents double password entry
* dApp request message sign and no popup is triggered from background.js
  - Doesn't always happen, hard to recreate
* Creating new account through dashboard defaults to mainnet
  - We no longer have the seedphrase
    - We cannot change HD path values (Ex: m/44/1/0/0 => m/44/1/0/1, m/44/1/0/2, m/44/1/0/3, etc)
    - Once we make the first account/wallet as mainnet they rest will automatically match
  - Allow importing an account (new seed phrase) and naming
  - Split root accounts (unique seed phrases) in dashboard menu (indicate mainnet vs testnet)
  - When importing a new account, check to make sure the first address created is unique, or else don't import

### Main TODO Item:
* Cleanup how we pull/save data
  - Redux store is a combination of multiple stores (walletConnect, accounts, etc)
  - Each redux store should initialize itself by pulling from browser storage (if possible since async...)
  - If not possible, need "init" function which will run on app startup, pulling all data in from browser, also event listeners

### Wallet Functionality
* Don't require authentication if the wallet is unlocked
* Re-add all protos
* Sign for transactions

### Wallet Connect / dApps
* When connecting into a dApp, user should be able to select target account to connect (and set active)
* Correctly form/create JWT when connecting with wallet connect (just dummy data right now)

### General
* In settings, allow user to set timeout for auto-logout
* Success page (typically used after a Notification)
* Auto check mnuemonic input fields as they are entered (make sure valid word)
* Generic success page/message
  - After creating an account or performing specific actions (vs just redirecting back to the landing page)
* Instead of "Please Wait" messages, show a full page spinning loader (can later add additional text)

### Accounts
* Creating/Recover account advanced options, mainnet = 505, testnet = 1 on HD path
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