import { BottomFloat, Content, Header, Button } from 'Components';
import { DASHBOARD_URL } from 'consts';
import { useNavigate } from 'react-router';

export const SendComplete = () => {
  const navigate = useNavigate();
  return (
    <Content>
      <Header title="Success" iconLeft='off'/>
      <p>Send Complete</p>
      <BottomFloat>
        <Button onClick={() => navigate(DASHBOARD_URL)}>Return to Dashboard</Button>
      </BottomFloat>
    </Content>
  );
};
