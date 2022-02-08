import { Outlet } from 'react-router-dom';

export const Page = ({ children }) => {
  return (
    <div>
      <Outlet />
      {children}
    </div>
  );
};
