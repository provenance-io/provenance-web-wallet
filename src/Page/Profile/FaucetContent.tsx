import { useState } from 'react';
import { Typo, Button } from 'Components';
import { useActiveAccount } from 'redux/hooks';
import { PROVENANCE_FAUCET_URL } from 'consts';

export const FaucetContent: React.FC = () => {
  const { address } = useActiveAccount();
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState('');

  const submitToFaucet = async () => {
    if (!apiLoading) {
      setApiError('');
      setApiResult('');
      setApiLoading(true);
      fetch(PROVENANCE_FAUCET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status)
            setApiResult(data.status === 'ok' ? 'Success' : data.status);
          else setApiResult(JSON.stringify(data));
          if (data.error) setApiError(data.error);
          setApiLoading(false);
        })
        .catch((error) => setApiError(error));
    }
  };

  return (
    <>
      <Typo type="footnote" align="left" marginBottom="20px">
        Address: {address}
      </Typo>
      <Button disabled={apiLoading} onClick={submitToFaucet}>
        {apiLoading ? 'Please Wait' : 'Use Faucet'}
      </Button>
      {apiError && (
        <Typo type="error" align="left" marginTop="20px">
          Failed: {apiError}
        </Typo>
      )}
      {apiResult && !apiError && (
        <Typo type="body" align="left" marginTop="20px">
          Status: {apiResult}
        </Typo>
      )}
    </>
  );
};
