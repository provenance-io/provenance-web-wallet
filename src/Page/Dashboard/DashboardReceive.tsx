import { useEffect, useState } from 'react';
import { Header, Input, Sprite } from 'Components';
import QRCode from 'qrcode';
import styled from 'styled-components';
import { trimAddress } from 'utils';
import { ICON_NAMES } from 'consts';

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Gothic A1', sans-serif;
`;
const Text = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  max-width: 270px;
  line-height: 2.2rem;
  margin: 100px auto 30px auto;
`;
const QRImage = styled.img`
  margin: auto;
  display: block;
  margin-bottom: 60px;
`;
const CopyButton = styled.div<{justCopied: boolean}>`
  position: absolute;
  top: 34px;
  padding: 10px;
  height: 42px;
  width: 42px;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ justCopied }) => justCopied ? '#086709' : '#2C2F3A' };
  z-index: 10;
  border-radius: 0 3px 3px 0;
  transition: 250ms all;
  cursor: ${({ justCopied }) => justCopied ? 'initial' : 'pointer' };
  &:hover {
    background: ${({ justCopied }) => !justCopied && '#3D3F4B' };
  }
`;

export const DashboardReceive:React.FC = () => {
  // TODO: Pull address from redux store
  const address = 'tp14lm3egzp8mkc3xu8z6c007agg4fnltar9f2vz2';
  const [qrcode, setQrcode] = useState('');
  const [justCopied, setJustCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(0);

  useEffect(() => {
    async function generateQRCode() {
      const newQrcode = await QRCode.toDataURL(address);
      setQrcode(newQrcode);
    }
    if (!qrcode) generateQRCode();
  }, [qrcode]);

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(
    () => () => {
      timeoutInstance && clearTimeout(timeoutInstance);
    },
    [timeoutInstance]
  );

  const copyAddress = () => {
    if (!justCopied) {
      window.navigator.clipboard.writeText(address).then(() => {
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
    <Wrapper>
      <Header title="Receive" />
      <Text>Show this QR code or share account address to receive assets</Text>
      {qrcode && <QRImage src={qrcode} alt="Address QR Code" />}
      <Input placeholder={trimAddress(address)} label="Wallet Address" disabled id="address">
        <CopyButton onClick={copyAddress} justCopied={justCopied}>
          {justCopied ? <Sprite icon={ICON_NAMES.CHECK} size="1.4rem" color='#CACC5D' /> : <Sprite icon={ICON_NAMES.COPY} size="1.4rem" color="#A2A7B9" />}
        </CopyButton>
      </Input>
    </Wrapper>
  );
};
