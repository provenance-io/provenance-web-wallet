# TODO
## To do shortlist

### Notes
* Issue connecting to WalletConnect:
* - When connecting from popup (first try)
*   - Works (has handshakeId, peerId, and peerMeta)
* - When connecting from saved uri later (second try)
*   - Fails (no handshakeId, peerId, or peerMeta)
* - Why is the uri "key" different between these?

### Wallet Functionality
* Sign messages
* Sign for transactions

### Wallet Connect / dApps
* When connecting into a dApp, user should be able to select target account to connect (and set active)
* Correctly form/create JWT when connecting with wallet connect

### General
* Create logout button
* Log user out once timeout reached
* In settings, allow user to set timeout for auto-logout
* Success page (typically used after a Notification)

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