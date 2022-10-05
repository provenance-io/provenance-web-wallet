import { Button, Input } from 'Components';
import { useState } from 'react';
import { useSettings } from 'redux/hooks';

export const WalletLockTimeout: React.FC = () => {
  const { unlockDuration } = useSettings();
  const [currentLockTimeout, setCurrentLockTimeout] = useState(unlockDuration);

  const handleValueSave = (value: string) => {};

  return (
    <>
      <Input
        id="wallet-lock-timeout"
        label="Set Wallet Lock Timeout (seconds)"
        placeholder="Enter a new value (seconds)"
        value={currentLockTimeout! / 1000}
        onChange={setCurrentLockTimeout}
      />
      <Button onClick={() => handleValueSave}>Save</Button>
    </>
  );
};
