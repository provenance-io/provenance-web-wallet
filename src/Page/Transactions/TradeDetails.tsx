import { useNavigate } from 'react-router-dom';
import { Message } from '../Confirm';

export const TradeDetails = () => {
  const navigate = useNavigate();

  // TO DO: This is just a fake message. Remove when able.
  const message = {
    platform: 'dLOB',
    wallet: "Honey's Wallet",
    order_type: 'Buy',
    amount: '20.000000000 Hash',
    price_per_unit: '20.000000000000 Hash',
    total_purchase_price: '0.400 USD',
    fee: '0.29476 hash',
  }

  const handleApprove = () => {
    // TO DO: Add any messages needing to be sent to chain to approve
    navigate('/transaction-complete');
  }

  return (
    <Message
      message={message}
      title='Trade Details'
      onClick={handleApprove}
      showData={false}
    />
  );
};