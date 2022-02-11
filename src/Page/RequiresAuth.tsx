import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const RequiresAuth = ({ children }: Props) => {
  return <>{children}</>;
};
