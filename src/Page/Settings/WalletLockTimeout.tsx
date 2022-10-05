import { Button, ButtonGroup, Input } from 'Components';
import { DEFAULT_UNLOCK_DURATION } from 'consts';
import { useState } from 'react';
import { useSettings } from 'redux/hooks';

export const WalletLockTimeout: React.FC = () => {
  const { unlockDuration, setUnlockDuration, bumpUnlockDuration } = useSettings();
  const [currentLockTimeout, setCurrentLockTimeout] = useState(unlockDuration);

  // Could potentially put these in utils, don't see use elsewhere yet.
  const convertMsToMin = (value: number) => value / 1000 / 60;
  const convertMinToMs = (value: number) => value * 1000 * 60;

  const handleValueSave = async () => {
    // Use the value entered, or if the value entered
    const newTimeoutMs = currentLockTimeout
      ? currentLockTimeout
      : DEFAULT_UNLOCK_DURATION;
    // If we have a value (not 'NaN'), save it to redux store
    if (newTimeoutMs) {
      await setUnlockDuration(newTimeoutMs);
      // After changing the timeout, bump the existing timeout
      await bumpUnlockDuration();
      // This will only matter when we are resetting to default
      setCurrentLockTimeout(newTimeoutMs);
    }
  };
  const handleValueChange = (value: string) => {
    // Save to state
    setCurrentLockTimeout(convertMinToMs(Number(value)));
  };
  const handleResetValue = () => {
    setCurrentLockTimeout(DEFAULT_UNLOCK_DURATION);
  };

  const valueChanged = currentLockTimeout !== unlockDuration;

  return (
    <>
      <Input
        id="wallet-lock-timeout"
        label="Set Wallet Lock Timeout (minutes)"
        placeholder={`Will set to default on save (${convertMsToMin(
          DEFAULT_UNLOCK_DURATION
        )} min)`}
        value={currentLockTimeout ? convertMsToMin(currentLockTimeout) : ''}
        onChange={(value: string) => handleValueChange(value)}
        type="number"
      />
      <ButtonGroup marginTop="20px" direction="row">
        <Button variant="secondary" onClick={handleResetValue}>
          Reset
        </Button>
        <Button onClick={handleValueSave} disabled={!valueChanged}>
          {valueChanged ? 'Save' : 'Saved'}
        </Button>
      </ButtonGroup>
    </>
  );
};
