import styled from 'styled-components';
import { capitalize } from 'utils';

const Section = styled.div`
  border-bottom: 1px solid #3d4151;
  padding: 20px 20px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SectionTitle = styled.div`
  font-weight: 100;
`;
const SectionContent = styled.div`
  font-weight: 100;
`;

interface ListProps {
  message: {
    [key: string]: string;
  };
}

export const List = ({
  message,
}: ListProps) => {

  const createList = Object.keys(message).map(item => (
    <Section key={item}>
      <SectionTitle>{capitalize(item)}</SectionTitle>
      <SectionContent>{message[item]}</SectionContent>
    </Section>
  ));

  return (
    <>
      {createList}
    </>
  )
};
