import React, { useEffect } from 'react';
import { APP_URL } from 'consts';
import { getKey } from 'utils';
import { useNavigate } from 'react-router-dom';
import { Page } from './Page';

interface Props {
  children?: React.ReactNode,
}

export const UnlockAuth = ({ children = null }: Props) => {
  const navigate = useNavigate();
  useEffect(() => {
    const getKeyAsync = async () => {
      const savedKey = await getKey();
      if (!savedKey) {
        navigate(APP_URL);
      }
    };
    getKeyAsync();
  }, [navigate]);

  return (
    <Page>
      {children}
    </Page>
  );
};
