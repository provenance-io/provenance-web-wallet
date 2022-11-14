import React from 'react';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../utils/test-utils';
import App from 'App';
import { TEST_WALLET } from 'consts';
import { getSavedData } from 'utils';

const { getByTestId, getByRole, getByText, getByLabelText } = screen;

test('Properly render the account recovery flow pages', async () => {
  const accountName = 'Account 01';
  const accountHDPath = "m/44'/1'/0'/0/0'";
  // Navigate to the recovery pages starting from App
  // ************************
  // APP.TSX
  // ************************
  act(() => {
    renderWithProviders(<App />);
  });
  // Wait for initial load/storage pull to finish
  await waitFor(() => {
    // Press Recover Wallet button to enter Recover wallet flow
    fireEvent.click(getByRole('button', { name: /Recover Wallet/i }));
  });
  // ************************
  // NEWACCOUNTNAME.TSX
  // ************************
  await act(async () => {
    // Page should change to recovery page
    expect(await getByText(/Name Your Account/i)).toBeInTheDocument();
    // Click Advanced Settings button to expand options
    fireEvent.click(getByTestId(/advanced-settings/i));
    // Expect to see testnet and mainnet pill buttons
    expect(await getByText(/testnet/i)).toBeInTheDocument();
    expect(await getByText(/mainnet/i)).toBeInTheDocument();
    // Click testnet button
    fireEvent.click(getByText(/testnet/i));
    // Expect the HD Path to have changed
    expect(await getByText(accountHDPath)).toBeInTheDocument();
    const accountNameInput = getByLabelText(/account name/i) as HTMLInputElement;
    // Enter an account name
    fireEvent.change(accountNameInput, { target: { value: accountName } });
    // Expect value to have changed
    expect(accountNameInput.value).toBe(accountName);
    // Click continue button to continue recovery
    fireEvent.click(getByRole('button', { name: /Continue/i }));
  });
  // ************************
  // SEEDPHRASEINFO.TSX
  // ************************
  await act(async () => {
    expect(
      await getByText(
        /In the following steps, you'll enter your 24-word recovery passphrase to access your account/i
      )
    ).toBeInTheDocument();
    // Click continue button to continue recovery
    fireEvent.click(getByRole('button', { name: /Continue/i }));
  });
  // ************************
  // SEEDPHRASEINPUT.TSX
  // ************************
  await act(async () => {
    expect(await getByText(/Enter Recovery Seedphrase/i)).toBeInTheDocument();
    // Select first input
    const word1Input = getByLabelText('Word 1') as HTMLInputElement;
    const word24Input = getByLabelText('Word 24') as HTMLInputElement;
    // Input the test seed phrase
    fireEvent.change(word1Input, { target: { value: TEST_WALLET } });
    // All inputs should have changed, check input 1 and 24
    expect(await word1Input.value).toBe(TEST_WALLET.split(' ')[0]);
    expect(await word24Input.value).toBe(TEST_WALLET.split(' ')[23]);
    // All words are filled out, press continue
    // Click continue button to continue recovery
    fireEvent.click(getByRole('button', { name: /Continue/i }));
  });
  // ************************
  // NEWACCOUNTPASSWORD.TSX
  // ************************
  await act(async () => {
    expect(
      await getByText(
        /Enter a wallet password. This password will be used for permissions, authentication, and unlocking. This password is only stored locally./i
      )
    ).toBeInTheDocument();
    // Default password to use for test account
    const password = '12345';
    // Select password inputs
    const passwordInput = getByLabelText('Wallet Password') as HTMLInputElement;
    const passwordConfirmInput = getByLabelText(
      'Confirm Wallet Password'
    ) as HTMLInputElement;
    // Fill in and confirm password
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.change(passwordConfirmInput, { target: { value: password } });
    // Select Continue button
    fireEvent.click(getByRole('button', { name: /Continue/i }));
  });
  // ************************
  // NEWACCOUNTSUCCESS.TSX
  // ************************
  await act(async () => {
    expect(
      await getByText(
        /Account has been successfully recovered. Click continue to proceed to the dashboard./i
      )
    ).toBeInTheDocument();
    // Check to make sure storage values reflect correct account information
    const accountAddress = 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh';
    const accountLevel = 'addressIndex';
    const accountNetwork = 'testnet';
    const accountPublicKey = 'Ax6LE0FlMU9qMFYEOJZpEXQ49IPjbsgCrk/2khQ6UM7k';
    // Pull saved information from storage to compare
    const { accounts } = await getSavedData('account');
    expect(accounts[0].address).toBe(accountAddress);
    expect(accounts[0].accountLevel).toBe(accountLevel);
    expect(accounts[0].network).toBe(accountNetwork);
    expect(accounts[0].publicKey).toBe(accountPublicKey);
    expect(accounts[0].name).toBe(accountName);
    expect(accounts[0].hdPath).toBe(accountHDPath);
  });
});
