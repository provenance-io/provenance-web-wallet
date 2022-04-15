import { useEffect, useState } from 'react';
import { Button, Input, Sprite } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import customizationCarousel from 'images/customization-carousel.svg';
import {
  numberFormat,
  encrypt,
  decrypt,
  getFromLocalStorage,
  addToLocalStorage,
  clearLocalStorage,
} from 'utils';
import { Title, InfoText } from 'Components';
import { useStatistics } from 'redux/hooks';

const CarouselContent = styled.div`
  cursor: pointer;
  user-select: none;
`;
const SliderControls = styled.div`
  margin-top: 50px;
  margin-bottom: 32px;
  display: flex;
`;
const Slider = styled.div<{ active: boolean }>`
  height: 4px;
  width: 30px;
  background: ${({ active }) => (active ? '#F3F4F6' : '#8B90A7')};
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
`;
const TextButton = styled.a`
  color: white;
  font-size: 1.4rem;
  margin-top: 32px;
  cursor: pointer;
  font-family: 'Gothic A1', sans-serif;
`;
const CustomizationImg = styled.img`
  margin-top: 45px;
  width: 210px;
`;
const StatsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`;
const StatItem = styled.div`
  flex-basis: 50%;
  margin-top: 32px;
`;
const StatTitle = styled.div`
  margin-top: 8px;
  font-size: 1.4rem;
`;
const StatValue = styled.div`
  font-size: 3.8rem;
  font-weight: 300;
`;
const StatValueSmall = styled.span`
  font-size: 2.4rem;
`;
const LocalAccountTest = styled.div`
  margin-top: 50px;
  background: #3c63a38c;
  padding: 40px;
  border-radius: 4px;
  button {
    margin: 10px 0;
  }
`;

export const Landing: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [localAccount, setLocalAccount] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accountName, setAccountName] = useState('');
  const navigate = useNavigate();
  const { getStatistics, statistics } = useStatistics();
  const { marketCap, validators, transactions, averageBlockTime } = statistics;

  // On load, check to see if the user has an account in localStorage
  useEffect(() => {
    const account = getFromLocalStorage('provenance-web-wallet', 'account') || '';
    setLocalAccount(account);
  }, []);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  const changePage = (location: string) => {
    navigate(`/${location}`);
  };
  const handleSliderChange = () => {
    if (currentSlide < 3) setCurrentSlide(currentSlide + 1);
    else setCurrentSlide(1);
  };
  const formatNumber = (value: number, digits = 1) =>
    numberFormat({ rawValue: value, digits, extraOptions: { shorthand: true } });
  const valueText = (
    value?: string | number,
    text?: string | number,
    position: 'front' | 'back' = 'front'
  ) => (
    <>
      {position === 'front' && <StatValueSmall>{text}</StatValueSmall>}
      {value}
      {position === 'back' && <StatValueSmall>{text}</StatValueSmall>}
    </>
  );
  const renderCarouselContent = () => {
    switch (currentSlide) {
      case 1:
        return (
          <CarouselContent onClick={handleSliderChange}>
            <Sprite icon="ICON::PROVENANCE" size="6rem" color="#3F80F3" />
            <Title>Provenance Wallet</Title>
            <InfoText>
              A wallet provides an easy way to manage multiple blockchain accounts.
            </InfoText>
          </CarouselContent>
        );
      case 2:
        return (
          <CarouselContent onClick={handleSliderChange}>
            <Title>Strong Fundamentals</Title>
            <StatsSection>
              <StatItem>
                <StatValue>
                  {marketCap ? valueText(formatNumber(marketCap), '$') : 'N/A'}
                </StatValue>
                <StatTitle>Market Cap</StatTitle>
              </StatItem>
              <StatItem>
                <StatValue>{validators || 'N/A'}</StatValue>
                <StatTitle>Validators</StatTitle>
              </StatItem>
              <StatItem>
                <StatValue>
                  {transactions ? formatNumber(transactions, 2) : 'N/A'}
                </StatValue>
                <StatTitle>Transactions</StatTitle>
              </StatItem>
              <StatItem>
                <StatValue>
                  {averageBlockTime
                    ? valueText(formatNumber(averageBlockTime, 3), 'sec', 'back')
                    : 'N/A'}
                </StatValue>
                <StatTitle>Avg Block Time</StatTitle>
              </StatItem>
            </StatsSection>
            <InfoText>Contract execution in seconds instead of weeks.</InfoText>
          </CarouselContent>
        );
      case 3:
        return (
          <CarouselContent onClick={handleSliderChange}>
            <Title>Powerful Customization</Title>
            <CustomizationImg
              src={customizationCarousel}
              alt="Figure and Provenance Logos"
            />
            <InfoText>
              Fully control your wallet and crypto, and manage it independently.
            </InfoText>
          </CarouselContent>
        );
      default:
        return null;
    }
  };

  const createLocalAccount = () => {
    setError('');
    if (password.length >= 5) {
      const newPrivateKey = 'abcdefghijklmnop12345678910';
      const encrypted = encrypt(newPrivateKey, password);
      const data = { account: accountName, data: encrypted };
      addToLocalStorage('provenance-web-wallet', data);
      setLoginSuccess(true);
    } else {
      setError('Minimum password length 5');
    }
  };

  const removeLocalAccount = () => {
    clearLocalStorage('provenance-web-wallet');
    setAccountName('');
    setPassword('');
    setError('');
    setLoginSuccess(false);
    setWrongPassword(false);
    setLocalAccount('');
  };

  const loginLocalAccount = () => {
    setError('');
    setWrongPassword(false);
    setLoginSuccess(false);
    const data = getFromLocalStorage('provenance-web-wallet', 'data');
    if (data) {
      if (password.length >= 5) {
        const decrypted = decrypt(data, password);
        if (decrypted) {
          setLoginSuccess(true);
          console.log('decrypted privateKey: ', decrypted);
        }
        else { setWrongPassword(true) }
      }
      else { setWrongPassword(true) }
    }
  };

  return (
    <>
      {renderCarouselContent()}
      <SliderControls>
        <Slider active={currentSlide === 1} onClick={() => setCurrentSlide(1)} />
        <Slider active={currentSlide === 2} onClick={() => setCurrentSlide(2)} />
        <Slider active={currentSlide === 3} onClick={() => setCurrentSlide(3)} />
      </SliderControls>
      <Button variant="primary" onClick={() => changePage('create')}>
        Create Wallet
      </Button>
      <TextButton onClick={() => changePage('recover')}>Recover Wallet</TextButton>
      <LocalAccountTest>
        {loginSuccess ? <InfoText>Successfully logged-in/created {localAccount || accountName}!</InfoText> :
          localAccount ? (
            <>
              <InfoText>Account Found ({localAccount})</InfoText>
              <Button variant="primary" onClick={loginLocalAccount}>Login</Button>
              <Button onClick={removeLocalAccount}>Remove Account</Button>
              {wrongPassword && <InfoText>Wrong Password!</InfoText>}
              <Input id="password" onChange={setPassword} placeholder="Enter Password" />
            </>
          ) : (
            <>
              <Input id="accountName" onChange={setAccountName} placeholder="Account Name" />
              {error && <div>{error}</div>}
              <Input id="password" onChange={setPassword} placeholder="Enter Password" />
              <Button variant="primary" onClick={createLocalAccount}>Create local account</Button>
            </>
          )
        }
      </LocalAccountTest>
    </>
  );
};
