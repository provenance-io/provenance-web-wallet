import { FooterNav, Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import { APP_URL, ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { useSettings } from 'redux/hooks';

const Container = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.4rem;
`;
const Title = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;
const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 1.9rem;
  border-bottom: 1px solid #3d4151;
  padding-bottom: 16px;
  margin-top: 32px;
`;
const SectionOption = styled.div`
  border-bottom: 1px solid #3d4151;
  padding: 20px 20px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 250ms all;
  &:hover {
    background: #3d4151;
  }
  &:active {
    background: #2c3040;
  }
`;

export const Profile = () => {
  const navigate = useNavigate();
  const { saveSettingsData } = useSettings();

  const createOption = (name: string, url: string, external?: boolean) => (
    <SectionOption onClick={() => external ? window.location.replace(url) : navigate(url)}>
      {name}
      <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
    </SectionOption>
  );

  const handleLockWallet = async () => {
    // Set expiration to now
    await saveSettingsData({ unlockEXP: Date.now() })
    // Redirect user to landing page
    navigate(APP_URL);
  };

  return (
    <Container>
      <Title>Profile</Title>
      <SectionTitle>Security</SectionTitle>
      {createOption('Pin Code', './pin-code')}
      {createOption('Reset Wallets', './reset-wallets')}
      <SectionTitle>General</SectionTitle>
      {createOption('About Provenance Blockchain', 'https://provenance.io', true)}
      {createOption('More Information', 'https://docs.provenance.io', true)}
      <SectionOption onClick={handleLockWallet}>
        Lock Wallet
        <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
      </SectionOption>
      <FooterNav />
    </Container>
  );
};
