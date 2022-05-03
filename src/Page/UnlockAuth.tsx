import { Page } from './Page';

interface Props {
  children?: React.ReactNode,
}

export const UnlockAuth = ({ children = null }: Props) => {

  return (
    <Page>
      {children}
    </Page>
  );
};
