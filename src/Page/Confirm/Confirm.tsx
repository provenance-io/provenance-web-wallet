import { Message, Connect } from '.';

export const Confirm = () => {

  // TO DO: Replace this with actual messages
  const message = {
    platform: 'Figure Equity Solutions',
    address: 'yoaddresshomie',
    created: '2022/04/11',
    type: 'Fake News',
    fees: '300 hash',
    to: 'yomomma',
    denom: 'hash',
    amount: '100.0101',
  }

  return (
    <Connect 
      requestor={"Figure Equity Solutions"}
      onClick={() => console.log('Clicked!')}
    />
  );
};
