import { useNavigate } from 'react-router';
import { Authenticate, Content, Header } from 'Components';
import { ICON_NAMES, SEND_AMOUNT_URL, SEND_COMPLETE_URL } from 'consts';
import { useMessage } from 'redux/hooks';

export const SendReview = () => {
  const navigate = useNavigate();
  const { coin } = useMessage();

  return !coin ? null : (
    <Content>
      <Header title="Send Review" iconLeft={ICON_NAMES.ARROW} />
      <h2>Confirm your information</h2>
      <p>Please review the details below to make sure everything is correct.</p>
      <Authenticate
        handleApprove={() => navigate(SEND_COMPLETE_URL)}
        handleDecline={() => navigate(SEND_AMOUNT_URL)}
        approveText="Sign &amp; Send"
        rejectText="Back"
      />
    </Content>
  );
};
