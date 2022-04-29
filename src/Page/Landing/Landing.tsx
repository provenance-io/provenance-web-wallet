import { Button, ButtonGroup } from 'Components';
import { useNavigate } from 'react-router-dom';
import { getKey } from 'utils';
import { Carousel } from './Carousel';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const savedKey = getKey();
  return (
    <>
      <Carousel />
      <ButtonGroup>
        {savedKey ? (
          <Button layout="default" onClick={() => navigate('/unlock')}>
            Unlock
          </Button>
        ) : (
          <Button layout="default" onClick={() => navigate('/create')}>
            Create Wallet
          </Button>
        )}
        <Button layout="default" variant="transparent" onClick={() => navigate('/recover')}>Recover Wallet</Button>
      </ButtonGroup>
    </>
  );
};
