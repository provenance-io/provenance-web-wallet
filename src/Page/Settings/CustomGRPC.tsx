import { useEffect, useState } from 'react';
import { Button, Input, ButtonGroup } from 'Components';
import { useActiveAccount, useSettings } from 'redux/hooks';
import { getGrpcApi, keyPress } from 'utils';

export const CustomGRPC: React.FC = () => {
  const { address } = useActiveAccount();
  const defaultGRPCApi = getGrpcApi(address!);
  const { customGRPCApi, saveSettingsData } = useSettings(); // Potential custom value used by user
  const [newAPIUrl, setNewAPIUrl] = useState(customGRPCApi || defaultGRPCApi);

  useEffect(() => {
    const currentGRPCApiUrl = customGRPCApi || defaultGRPCApi;
    setNewAPIUrl(currentGRPCApiUrl);
  }, [customGRPCApi, defaultGRPCApi]);

  const handleSubmit = async (reset?: boolean) => {
    // If we reset or are using the default api, set custom to empty
    const finalGRPCApiUrl = reset
      ? ''
      : newAPIUrl === defaultGRPCApi
      ? ''
      : newAPIUrl;
    // A reset will change customGRPCApi back to '' so the defaults get pulled based on the active account
    await saveSettingsData({ customGRPCApi: finalGRPCApiUrl });
  };

  // Is the current input value the same value as when we started (either customGRPCApi or defaultGRPCApi)
  const inputValueHasChanged =
    newAPIUrl !== defaultGRPCApi && newAPIUrl !== customGRPCApi;
  // Is the current input value a customGRPCApi url (not defaultGRPCApi)
  const inputValueIsDefault =
    customGRPCApi === defaultGRPCApi || customGRPCApi === '';

  return (
    <>
      <Input
        value={newAPIUrl}
        id="customGRPCApi"
        autoFocus={true}
        label={`gRPC api url (${inputValueIsDefault ? 'Default' : 'Custom'})`}
        placeholder="Enter new gRPC api url"
        onChange={setNewAPIUrl}
        onKeyPress={(e) => keyPress(e, () => handleSubmit())}
      />
      <ButtonGroup marginTop="20px">
        <Button onClick={() => handleSubmit()} disabled={!inputValueHasChanged}>
          Save
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSubmit(true)}
          disabled={inputValueIsDefault}
        >
          Reset to Default
        </Button>
      </ButtonGroup>
    </>
  );
};
