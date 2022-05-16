import { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'Components';
import { useNavigate } from 'react-router-dom';
import { getKey } from 'utils';
import { Carousel } from './Carousel';
import { CREATE_URL, RECOVER_URL, UNLOCK_URL } from 'consts';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    console.log('Landing | useEffect');
    const asyncGetKey = async () => {
      const key = await getKey();
      setLoading(false);
      setSavedKey(key);
    };
    asyncGetKey();
  }, []);
  
  const renderLandingActions = () => savedKey ? (
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
        {loading ? <div>Loading...</div> : renderLandingActions()}
        <Button layout="default" variant="transparent" onClick={() => navigate(RECOVER_URL)}>Recover Wallet</Button>
      </ButtonGroup>
    </>
  );
};
