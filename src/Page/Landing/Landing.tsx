import { Button, ButtonGroup } from 'Components';
import { useNavigate } from 'react-router-dom';
import { Carousel } from './Carousel';
import { CREATE_URL, RECOVER_URL, UNLOCK_URL } from 'consts';
import { useAccount } from 'redux/hooks';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { key } = useAccount();
  
  const renderLandingActions = () => key ? (
    <Button layout="default" onClick={() => navigate(UNLOCK_URL)}>
      Unlock
    </Button>
  ) : (
    <Button layout="default" onClick={() => navigate(CREATE_URL)}>
      Create Wallet
    </Button>
  );

  return (
    <>
      <Carousel />
      <ButtonGroup>
        {renderLandingActions()}
        <Button layout="default" variant="transparent" onClick={() => navigate(RECOVER_URL)}>Recover Wallet</Button>
      </ButtonGroup>
    </>
  );
};
