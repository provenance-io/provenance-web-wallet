import {
  DASHBOARD_URL,
  DASHBOARD_RECEIVE_URL,
  DASHBOARD_MENU_URL,
  DASHBOARD_CONNECTION_DETAILS_URL,
} from 'consts';
import {
  Page,
  Dashboard,
  DashboardReceive,
  DashboardMenu,
  DashboardConnectionDetails,
} from 'Page';

export const DASHBOARD = {
  path: DASHBOARD_URL,
  element: <Page bgImage={true} />,
  children: [{ index: true, element: <Dashboard /> }],
};
export const DASHBOARD_MENU = {
  path: DASHBOARD_MENU_URL,
  element: <Page />,
  children: [{ index: true, element: <DashboardMenu /> }],
};
export const DASHBOARD_RECEIVE = {
  path: DASHBOARD_RECEIVE_URL,
  element: <Page />,
  children: [{ index: true, element: <DashboardReceive /> }],
};
export const DASHBOARD_CONNECTION_DETAILS = {
  path: DASHBOARD_CONNECTION_DETAILS_URL,
  element: <Page />,
  children: [{ index: true, element: <DashboardConnectionDetails /> }],
};
