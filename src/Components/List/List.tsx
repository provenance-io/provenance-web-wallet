import styled from 'styled-components';
import { capitalize, camelToSentence, trimString, hashFormat } from 'utils';
import { COLORS } from 'theme';
import { CopyValue } from 'Components/CopyValue';

const ListRow = styled.div`
  border-top: 1px solid ${COLORS.NEUTRAL_600};
  padding: 16px 8px;
  display: flex;
  justify-content: space-between;
  &:first-of-type {
    border-top: none;
  }
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
    [key: string]: string | number | undefined;
  };
}

export const List = ({
  message,
}: ListProps) => {

  const getItem = (item: string, message: ListProps["message"]) => {
    switch (item) {
      case 'hash':
        return trimString(String(message[item]), 14, 7);
      case 'signer': {
        return (
          <CopyValue value={String(message[item])}>
            {trimString(String(message[item]), 14, 7)}
          </CopyValue>
        );
      }
      case 'feeAmount':
        return `${hashFormat('hash', Number(message[item]))} hash`;
      case 'status':
      case 'type':
        return capitalize(String(message[item]));
      default:
        return message[item];
    }
  }

  const createList = Object.keys(message).map(item => (
    <ListRow key={item}>
      <ListContent>{camelToSentence(item)}</ListContent>
      <ListContent>{getItem(item, message)}</ListContent>
    </ListRow>
  ));

  return (
    <>
      {createList}
    </>
  )
};
