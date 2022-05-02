import { Button, ButtonGroup } from 'Components';
import { useNavigate } from 'react-router-dom';
import { getKey } from 'utils';
import { Carousel } from './Carousel';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const renderLandingActions = async () => {
    const savedKey = await getKey();
    return savedKey ? (
      <Button layout="default" onClick={() => navigate('/unlock')}>
        Unlock
      </Button>
    ) : (
      <Button layout="default" onClick={() => navigate('/create')}>
        Create Wallet
      </Button>
    )
  };

  return (
    <>
      <Carousel />
      <ButtonGroup>
        {renderLandingActions()}
        <Button layout="default" variant="transparent" onClick={() => navigate('/recover')}>Recover Wallet</Button>
      </ButtonGroup>
    </>
  );
};
