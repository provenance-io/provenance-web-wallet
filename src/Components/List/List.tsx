import styled from 'styled-components';
import { capitalize, getJSType } from 'utils';
import { COLORS } from 'theme';
import { Typo } from '../Typography/Typo';
import React from 'react';

const ListContainer = styled.div<{
  marginBottom?: string,
  marginTop?: string,
  maxHeight?: string
}>`
  ${({ marginBottom }) => !!marginBottom && `margin-bottom: ${marginBottom};` }
  ${({ marginTop }) => !!marginTop && `margin-top: ${marginTop};` }
  ${({ maxHeight }) => !!maxHeight && `max-height: ${maxHeight}; overflow-y: scroll;` }
  // Attempt to style the scrollbar
  &::-webkit-scrollbar-thumb {
    background-color: ${COLORS.PRIMARY_500};
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px ${COLORS.PRIMARY_600};
  }
  &::-webkit-scrollbar {
    width: 2px;
  }
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
    text-align: left;
  }
  &:nth-child(2) {
    margin-left: 6px;
    text-align: right;
    word-break: break-all;
  }
`;

interface MessageObject {
  [key: string]: string | number | object | undefined;
}
interface ListProps {
  message: MessageObject;
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

  const createListContent = (listObject: MessageObject) => {
    const listObjKeys = Object.keys(listObject);
    return listObjKeys.map(key => {
      const listObjValue = listObject[key];
      const listObjValueJSType = getJSType(listObjValue);
      // TODO: Not do this...
      const displayValue = listObjValue === undefined ?
        'N/A' :
        listObjValueJSType === 'boolean' ?
        !!listObjValue ?
        'Yes' :
        'No' :
        listObjValue;
      return (
        <ListRow key={key}>
          <ListContent>{capitalize(key, 'camelcase')}</ListContent>
          <ListContent>{displayValue}</ListContent>
        </ListRow>
      )
    });
  };

  const createListRows = () => Object.keys(message).map(messageRowKey => {
    const messageRowValue = message[messageRowKey];
    const messageRowValueJSType = getJSType(messageRowValue);
    // If the item's child is an object, then set a title above the row (section)
    const messageRowValueIsObject = messageRowValueJSType === 'object';
    return (
      <React.Fragment key={messageRowKey}>
        {messageRowValueIsObject && <Typo type='displayBody' align='left' marginTop='20px' marginBottom='10px'>{capitalize(messageRowKey, 'camelcase')}</Typo>}
        {createListContent(messageRowValueIsObject ? messageRowValue as MessageObject: { [messageRowKey]: messageRowValue })}
      </React.Fragment>
    )
  });

  return (
    <ListContainer marginBottom={marginBottom} maxHeight={maxHeight} marginTop={marginTop}>
      {createListRows()}
    </ListContainer>
  )
};
