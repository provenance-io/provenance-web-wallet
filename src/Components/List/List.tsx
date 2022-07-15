import styled from 'styled-components';
import { capitalize } from 'utils';
import { COLORS } from 'theme';

const ListContainer = styled.div<{
  marginBottom?: string,
  marginTop?: string,
  maxHeight?: string
}>`
  ${({ marginBottom }) => !!marginBottom && `margin-bottom: ${marginBottom};` }
  ${({ marginTop }) => !!marginTop && `margin-top: ${marginTop};` }
  ${({ maxHeight }) => !!maxHeight && `max-height: ${maxHeight}; overflow-y: scroll;` }
`;

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
    [key: string]: string | number | undefined;
  };
  marginBottom?: string;
  marginTop?: string;
  maxHeight?: string;
}

export const List = ({
  message,
  marginBottom,
  marginTop,
  maxHeight,
}: ListProps) => {

  const createList = Object.keys(message).map(item => (
    <ListRow key={item}>
      <ListContent>{capitalize(item, 'camelcase')}</ListContent>
      <ListContent>{message[item] !== undefined ? message[item] : 'N/A'}</ListContent>
    </ListRow>
  ));

  return (
    <ListContainer marginBottom={marginBottom} maxHeight={maxHeight} marginTop={marginTop}>
      {createList}
    </ListContainer>
  )
};
