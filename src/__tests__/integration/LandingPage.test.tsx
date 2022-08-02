import { screen, waitFor } from '@testing-library/react';
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../utils/test-utils';
import App from 'App';

const { getByText, getByTestId } = screen;

test('Properly render the landing page of the app (fresh install)', async () => {
  // Navigate from App to Recovery Pages
  renderWithProviders(<App />);

  // Initial load, should show loading component while it pulls initial data from storage
  expect(await getByTestId(/loading/i)).toBeInTheDocument();
  // Initial data loaded, now standard landing copy should exist
  await waitFor(() => {
    expect(getByText(/Recover Wallet/i)).toBeInTheDocument();
    expect(getByText(/Create Wallet/i)).toBeInTheDocument();
  });
});
