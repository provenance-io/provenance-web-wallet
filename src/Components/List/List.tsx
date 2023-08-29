import styled from 'styled-components';
import { capitalize, getExplorerApi, getJSType, hashFormat } from 'utils';
import { COLORS } from 'theme';
import { Typo } from '../Typo/Typo';
import React from 'react';
import { useActiveAccount } from 'redux/hooks';
import { EXPLORER_WEB_BLOCK, EXPLORER_WEB_TX_HASH } from 'consts';

const ListContainer = styled.div<{
  marginBottom?: string;
  marginTop?: string;
  maxHeight?: string;
}>`
  ${({ marginBottom }) => !!marginBottom && `margin-bottom: ${marginBottom};`}
  ${({ marginTop }) => !!marginTop && `margin-top: ${marginTop};`}
  ${({ maxHeight }) =>
    !!maxHeight && `max-height: ${maxHeight}; overflow-y: scroll;`}
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
    word-break: break-word;
  }
`;

type MessageValue = string | number | object | undefined;

interface MessageObject {
  [key: string]: MessageValue;
}
interface ListProps {
  message: MessageObject;
  marginBottom?: string;
  marginTop?: string;
  maxHeight?: string;
  type?: 'txcomplete';
  showRawLog?: boolean;
}

// // TODO: List should just take an array of fields in the order we want to show them
// For now, going to just pass a boolean to show rawLog
export const List = ({
  message,
  marginBottom,
  marginTop,
  maxHeight,
  type,
  showRawLog,
}: ListProps) => {
  const { address } = useActiveAccount();
  // Format specific names
  const formatKey = (key: string) => {
    switch (key.toLowerCase()) {
      case 'hash': // fallthrough
      case 'txhash':
        return 'Tx Hash';
      case 'height':
        return 'Block Height';
      case 'rawlog':
        return 'Error';
      default:
        return key;
    }
  };
  const formatValue = (key: string, value: MessageValue) => {
    if (value === undefined) return 'N/A';
    if (getJSType(value) === 'boolean') return !!value ? 'Yes' : 'No';
    switch (key.toLowerCase()) {
      case 'tx hash':
        return (
          <a
            href={`${getExplorerApi(address!, EXPLORER_WEB_TX_HASH)}/${value}`}
            title="View transaction on Provenance Blockchain Explorer"
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        );
      case 'block height':
        return (
          <a
            href={`${getExplorerApi(address!, EXPLORER_WEB_BLOCK)}/${value}`}
            title="View block on Provenance Blockchain Explorer"
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        );
      case 'gaswanted': // fallthrough
      case 'gasused':
        return `${hashFormat(value as number)} Hash`;
      default:
        return value;
    }
  };

  // Certain message types only need to display certain information and discard the rest
  // Users can always click "data" button to see full message
  const txCompleteKeys = [
    'platform',
    'gasfee',
    'gaswanted',
    'gasused',
    'txhash',
    'height',
    'date',
    showRawLog ? 'rawlog' : '',
  ];
  const filterKeysByType = (key: string) => {
    let result = true;
    if (!type) return result;
    switch (type) {
      case 'txcomplete':
        result = txCompleteKeys.includes(key.toLowerCase());
        break;
      default:
        break;
    }
    return result;
  };

  const createListContent = (listObject: MessageObject) => {
    const listObjKeys = Object.keys(listObject);
    return listObjKeys.map((key) => {
      const listObjValue = listObject[key];
      // Format the key and value if needed
      const formattedKey = formatKey(key);
      const formattedValue = formatValue(formattedKey, listObjValue);
      return (
        <ListRow key={key}>
          <ListContent>{capitalize(formattedKey, 'camelcase')}</ListContent>
          <ListContent>{formattedValue}</ListContent>
        </ListRow>
      );
    });
  };

  const createListRows = () =>
    Object.keys(message)
      .filter(filterKeysByType)
      .sort()
      .map((messageRowKey) => {
        const messageRowValue = message[messageRowKey];
        const messageRowValueJSType = getJSType(messageRowValue);
        // If the item's child is an object, then set a title above the row (section)
        const messageRowValueIsObject = messageRowValueJSType === 'object';
        return (
          <React.Fragment key={messageRowKey}>
            {messageRowValueIsObject && (
              <Typo
                type="displayBody"
                align="left"
                marginTop="20px"
                marginBottom="10px"
              >
                {capitalize(messageRowKey, 'camelcase')}
              </Typo>
            )}
            {createListContent(
              messageRowValueIsObject
                ? (messageRowValue as MessageObject)
                : { [messageRowKey]: messageRowValue }
            )}
          </React.Fragment>
        );
      });

  return (
    <ListContainer
      marginBottom={marginBottom}
      maxHeight={maxHeight}
      marginTop={marginTop}
    >
      {createListRows()}
    </ListContainer>
  );
};
