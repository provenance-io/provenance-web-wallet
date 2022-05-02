import { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'Components';
import { useNavigate } from 'react-router-dom';
import { getKey } from 'utils';
import { Carousel } from './Carousel';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    const asyncGetKey = async () => {
      const key = await getKey();
      setLoading(false);
      setSavedKey(key);
    };
    asyncGetKey();
  }, []);
  
  const renderLandingActions = () => {
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
        {loading ? <div>Loading...</div> : renderLandingActions()}
        <Button layout="default" variant="transparent" onClick={() => navigate('/recover')}>Recover Wallet</Button>
      </ButtonGroup>
    </>
  );
};
