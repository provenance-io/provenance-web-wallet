import { Content, FooterNav, Sprite, Typo } from 'Components';
import { useNavigate } from 'react-router-dom';
import {
  APP_URL,
  ICON_NAMES,
  PROVENANCE_WEB_DOCS_URL,
  PROVENANCE_WEB_URL,
  RESET_WALLET_URL,
  ADVANCED_SETTINGS_URL,
  APP_DATA,
} from 'consts';
import styled from 'styled-components';
import { useSettings } from 'redux/hooks';
import { COLORS, FONTS } from 'theme';

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 1.9rem;
  border-bottom: 1px solid ${COLORS.NEUTRAL_600};
  padding-bottom: 16px;
  margin-top: 32px;
`;
const SectionOption = styled.div`
  border-bottom: 1px solid ${COLORS.NEUTRAL_600};
  padding: 20px 20px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-family: ${FONTS.PRIMARY_FONT};
  font-size: 1.4rem;
  align-items: center;
  transition: 250ms all;
  &:hover {
    background: ${COLORS.NEUTRAL_600};
  }
  &:active {
    background: ${COLORS.NEUTRAL_700};
  }
`;
const Version = styled(Typo)`
  position: absolute;
  top: 34px;
  right: 20px;
`;

export const Settings = () => {
  const navigate = useNavigate();
  const { lockWallet } = useSettings();

  const createOption = (name: string, url: string, external?: boolean) => (
    <SectionOption
      onClick={() => {
        if (external) {
          chrome.tabs.update({ url });
        } else {
          navigate(url);
        }
      }}
    >
      {name}
      <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
    </SectionOption>
  );

  const handleLockWallet = async () => {
    // Set expiration to now
    await lockWallet();
    // Redirect user to landing page
    navigate(APP_URL);
  };

  return (
    <Content>
      <Typo type="headline2">Settings</Typo>
      <SectionTitle>Security</SectionTitle>
      {createOption('Destroy Wallet', RESET_WALLET_URL)}
      <SectionTitle>General</SectionTitle>
      {createOption('About Provenance Blockchain', PROVENANCE_WEB_URL, true)}
      {createOption('More Information', PROVENANCE_WEB_DOCS_URL, true)}
      {createOption('Advanced Settings', ADVANCED_SETTINGS_URL)}
      <SectionOption onClick={handleLockWallet}>
        Lock Wallet
        <Sprite icon={ICON_NAMES.CHEVRON} size="1.3rem" />
      </SectionOption>
      <Version type="footnote" align="right" italic>
        v{APP_DATA.version}
      </Version>
      <FooterNav />
    </Content>
  );
};
