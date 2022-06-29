import {
  DASHBOARD_URL,
  DASHBOARD_SEND_URL,
  DASHBOARD_RECEIVE_URL,
  DASHBOARD_MENU_URL,
  DASHBOARD_CONNECTION_DETAILS_URL,
} from 'consts';
import {
  Page,
  Dashboard,
  DashboardSend,
  DashboardReceive,
  DashboardMenu,
  DashboardConnectionDetails,
} from 'Page';

export const DASHBOARD = {
  path: DASHBOARD_URL,
  element: <Page />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: DASHBOARD_SEND_URL, element: <DashboardSend /> },
    { path: DASHBOARD_RECEIVE_URL, element: <DashboardReceive /> },
    { path: DASHBOARD_MENU_URL, element: <DashboardMenu /> },
    { path: DASHBOARD_CONNECTION_DETAILS_URL, element: <DashboardConnectionDetails /> },
  ]
};
