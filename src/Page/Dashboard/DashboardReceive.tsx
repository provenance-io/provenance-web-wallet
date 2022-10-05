import { useEffect, useState } from 'react';
import { Content, Header, Input, Sprite, Typo } from 'Components';
import QRCode from 'qrcode';
import styled from 'styled-components';
import { trimString } from 'utils';
import { ICON_NAMES } from 'consts';
import { useActiveAccount } from 'redux/hooks';
import { COLORS } from 'theme';

const QRImage = styled.img`
  margin: auto;
  display: block;
  margin-bottom: 60px;
`;
const CopyButton = styled.div<{ justCopied: boolean }>`
  position: absolute;
  top: 33px;
  padding: 10px;
  height: 42px;
  width: 42px;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ justCopied }) =>
    justCopied ? COLORS.POSITIVE_500 : COLORS.PRIMARY_500};
  z-index: 10;
  border-radius: 0 3px 3px 0;
  transition: 250ms all;
  cursor: ${({ justCopied }) => (justCopied ? 'initial' : 'pointer')};
  &:hover {
    background: ${({ justCopied }) => !justCopied && COLORS.NEUTRAL_600};
  }
`;

export const DashboardReceive: React.FC = () => {
  const { address } = useActiveAccount();
  const [qrcode, setQrcode] = useState('');
  const [justCopied, setJustCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(0);

  useEffect(() => {
    async function generateQRCode() {
      const newQrcode = await QRCode.toDataURL(address!);
      setQrcode(newQrcode);
    }
    if (!qrcode) generateQRCode();
  }, [qrcode, address]);

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(
    () => () => {
      timeoutInstance && clearTimeout(timeoutInstance);
    },
    [timeoutInstance]
  );

  const copyAddress = () => {
    if (!justCopied) {
      window.navigator.clipboard.writeText(address!).then(() => {
        window.clearTimeout(timeoutInstance);
        setJustCopied(true);
        const newTimeoutInstance = window.setTimeout(() => {
          setJustCopied(false);
        }, 1000);
        setTimeoutInstance(newTimeoutInstance);
      });
    }
  };

  return (
    <Content>
      <Header title="Receive" />
      <Typo type="subhead" marginTop="40px" marginBottom="20px" maxWidth="260px">
        Show this QR code or share account address to receive assets
      </Typo>
      {qrcode && <QRImage src={qrcode} alt="Address QR Code" />}
      <Input
        placeholder={trimString(address!, 32, 16)}
        label="Wallet Address"
        disabled
        id="address"
      >
        <CopyButton onClick={copyAddress} justCopied={justCopied}>
          {justCopied ? (
            <Sprite icon={ICON_NAMES.CHECK} size="1.4rem" color={COLORS.WHITE} />
          ) : (
            <Sprite icon={ICON_NAMES.COPY} size="1.4rem" color={COLORS.WHITE} />
          )}
        </CopyButton>
      </Input>
    </Content>
  );
};
