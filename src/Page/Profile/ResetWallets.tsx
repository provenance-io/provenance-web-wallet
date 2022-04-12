import { FooterNav } from 'Components';
import { Button } from 'Components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { COLORS } from 'theme';

const Container = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 90%;
`;
const Title = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;
const SectionOption = styled.div`
  padding: 20px 20px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const ButtonGroup = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
`;
const CancelButton = styled(Button)`
  color: ${COLORS.PRIMARY_550};
  background: none;
  border: none;
  margin-top: 10px;
`;

export const ResetWallets = () => {

  const navigate = useNavigate();

  const handleReset = () => {
    // TODO: Build out reset functionality
    return;
  }

  return (
    <Container>
      <Title>Reset Wallets</Title>
      <SectionOption>Are you sure you wish to reset all wallets?</SectionOption>
      <ButtonGroup>
        <Button variant={'primary'} onClick={handleReset}>Reset Wallets</Button>
        <CancelButton variant={'default'} onClick={() => navigate('/profile')}>Cancel</CancelButton>
      </ButtonGroup>
      <FooterNav />
    </Container>
  );
};