import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSettings } from 'redux/hooks';

interface Props {
  children: React.ReactNode;
}

export const LockCheck: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { locked, unlockEXP, lockWallet, bumpUnlockDuration } = useSettings();
  const [walletLockTimeout, setWalletLockTimeout] = useState(0);
  const [previousUnlockEXP, setPreviousUnlockEXP] = useState(unlockEXP);
  const [previousPageLocation, setPreviousPageLocation] = useState(
    location.pathname
  );

  // --------------------------------------------
  // Bump walletLock whenever the page changes
  // --------------------------------------------
  useEffect(() => {
    // Only run if the page has changed
    const currentPageLocation = location.pathname;
    if (currentPageLocation !== previousPageLocation) {
      const asyncBumpUnlock = async () => {
        await bumpUnlockDuration();
      };
      if (!locked) asyncBumpUnlock();
      setPreviousPageLocation(currentPageLocation);
    }
  }, [location, bumpUnlockDuration, locked, previousPageLocation]);

  // ----------------------------------------------------
  // Create/Remove/Update walletLockTimeout as needed
  // ----------------------------------------------------
  useEffect(() => {
    // Function to build a new walletLockTimeout
    const createNewWalletLockTimeout = () => {
      // Current time
      const now = Date.now();
      // How long will this wallet be unlocked for
      const lockDuration = (unlockEXP || 0) - now;
      // Create new wallet lock timeout countdown
      const newWalletLockTimeout = window.setTimeout(async () => {
        // Lock wallet (redux store/localStorage)
        await lockWallet();
        // Remove walletLock state data from this component
        setWalletLockTimeout(0);
      }, lockDuration);
      // Save new timeout values into local state
      setWalletLockTimeout(newWalletLockTimeout);
    };

    // Wallet must be unlocked to change/update/remove the walletLockTimer
    if (!locked) {
      // Check to see if a walletLock timer was already in progress
      if (!walletLockTimeout) {
        createNewWalletLockTimeout();
      }
      // Previous walletLockTimeout running, but we now have a new expiration data (been bumped), rebuild it
      else if (unlockEXP !== previousUnlockEXP) {
        // Stop the current timer (time has been bumped)
        window.clearTimeout(walletLockTimeout);
        // Create a new timeout with the latest lock exp value
        createNewWalletLockTimeout();
      }
      // Store the new unlockExp value as needed (if the value is the same then nothing should re-render)
      setPreviousUnlockEXP(unlockEXP);
    }
  }, [locked, walletLockTimeout, unlockEXP, lockWallet, previousUnlockEXP]);

  return <>{children}</>;
};
