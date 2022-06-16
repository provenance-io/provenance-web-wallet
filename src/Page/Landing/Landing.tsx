import { Button, ButtonGroup } from 'Components';
import { useNavigate } from 'react-router-dom';
import { Carousel } from './Carousel';
import { NEW_ACCOUNT_CREATE_URL, NEW_ACCOUNT_RECOVER_URL, UNLOCK_URL } from 'consts';
import { useActiveAccount } from 'redux/hooks';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { masterKey } = useActiveAccount();
  
  const renderLandingActions = () => masterKey ? (
    <Button layout="default" onClick={() => navigate(UNLOCK_URL)}>
      Unlock
    </Button>
  ) : (
    <Button layout="default" onClick={() => navigate(NEW_ACCOUNT_CREATE_URL)}>
      Create Wallet
    </Button>
  );

  return (
    <>
      <Carousel />
      <ButtonGroup>
        {renderLandingActions()}
        <Button layout="default" variant="transparent" onClick={() => navigate(NEW_ACCOUNT_RECOVER_URL)}>Recover Wallet</Button>
      </ButtonGroup>
    </>
  );
};
