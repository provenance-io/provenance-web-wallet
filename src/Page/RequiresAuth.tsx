import React from 'react';
import { Outlet } from 'react-router-dom';

interface PageProps {
  children?: React.ReactNode;
}

export const RequiresAuth = ({ children = null }: PageProps) => (
  <>
    <Outlet />
    {children}
  </>
);
