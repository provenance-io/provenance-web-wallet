import styled from 'styled-components';
import { capitalize } from 'utils';
import { COLORS } from 'theme';

const ListRow = styled.div`
  border-top: 1px solid ${COLORS.NEUTRAL_600};
  padding: 16px 8px;
  display: flex;
  justify-content: space-between;
`;
const ListContent = styled.div`
  font-size: 1.4rem;
  &:nth-child(1) {
    margin-right: 6px;
    min-width: 80px;
  }
  &:nth-child(2) {
    margin-left: 6px;
    text-align: right;
    word-break: break-all;
  }
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
    <ListRow key={item}>
      <ListContent>{capitalize(item)}</ListContent>
      <ListContent>{message[item]}</ListContent>
    </ListRow>
  ));

  return (
    <>
      {createList}
    </>
  )
};
