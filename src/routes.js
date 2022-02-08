import { Navigate } from 'react-router-dom';
import { Dashboard, Login, Page, RequiresAuth } from 'Page';

export const APP_URL = '/';
export const DASHBOARD_URL = '/dashboard';
export const LOGIN_URL = '/login';

export const routes = [
  {
    path: APP_URL,
    element: (
      <RequiresAuth>
        <Page />
      </RequiresAuth>
    ),
    children: [
      { index: true, element: <Navigate to={DASHBOARD_URL} /> },
      { path: DASHBOARD_URL, element: <Dashboard /> },
    ],
  },
  { path: LOGIN_URL, element: <Login /> },
  // { path: FOUR_OH_FOUR_URL, element: <NotFound /> },
  // { path: '*', element: <Navigate to={FOUR_OH_FOUR_URL} /> },
];
