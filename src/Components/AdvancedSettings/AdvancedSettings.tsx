import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import {
  TESTNET_WALLET_COIN_TYPE,
  PROVENANCE_WALLET_COIN_TYPE,
  DEFAULT_MAINNET_HD_PATH,
  DEFAULT_TESTNET_HD_PATH,
  HD_PATH_KEYS,
} from 'consts';
import { Pill as PillBase } from 'Components/Pill';
import { Checkbox as BaseCheckbox } from 'Components/Checkbox';
import { ScrollContainer } from 'Components/ScrollContainer';
import { COLORS } from 'theme';
import { AccountLevel, HDPathData } from 'types';
import { getHDPathData, capitalize } from 'utils';

interface StyledProps {
  disabled?: boolean;
}

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
    font-weight: bold;
    color: ${COLORS.NEUTRAL_300};
  }
`;
const HDPathText = styled.span`
  font-family: 'Courier New', Courier, monospace;
`;
const DerivationSection = styled.div`
  padding: 0 8px;
`;
const Pill = styled(PillBase)`
  margin-bottom: 20px;
`;
const Headers = styled.div`
  display: flex;
  font-size: 9px;
  padding: 0 8px;
  margin-bottom: 8px;
  justify-content: space-between;
`;
const HeadersType = styled.div`
  min-width: 100px;
`;
const HeadersValue = styled.div`
  flex-grow: 1;
`;
const HeadersHard = styled.div`
  min-width: 50px;
  text-align: right;
`;
const LineInput = styled.div<StyledProps>`
  border-top: 1px solid ${COLORS.NEUTRAL_600};
  padding: 16px 8px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.25;
    cursor: not-allowed;
  `}
`;
const LineInputTitle = styled.div`
  user-select: none;
  min-width: 100px;
`;
const ValueInput = styled.input`
  color: ${COLORS.NEUTRAL_300};
  background: none;
  border: none;
  flex-grow: 1;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
const Checkbox = styled(BaseCheckbox)`
  min-width: 20px;
`;

interface Props {
  setResults: (hdPath: string) => void;
  parentHdPath?: string;
  setContinueDisabled: (value: boolean) => void;
}

export const AdvancedSettings: React.FC<Props> = ({
  setResults,
  parentHdPath,
  setContinueDisabled,
}) => {
  const [accountHdPath, setAccountHdPath] = useState(
    parentHdPath || DEFAULT_MAINNET_HD_PATH
  ); // example: m/44'/505'/0'
  const [accountHdPathData, setAcccountHdPathData] = useState(
    getHDPathData(parentHdPath || DEFAULT_MAINNET_HD_PATH)
  ); // example: { purpose: { value: 44, hardened: true, display: "44'" }, ... }
  const parentHdPathData = useMemo(
    () => (parentHdPath ? getHDPathData(parentHdPath) : {}),
    [parentHdPath]
  ) as HDPathData;

  // Pull out some values from accountHdPathData
  const { accountLevel, coinType } = accountHdPathData;

  // Whenever the accountHdPath changes, update the accountHdPathData and send results to callback fx
  useEffect(() => {
    const updatedAccountHdPathData = getHDPathData(accountHdPath);
    setAcccountHdPathData(updatedAccountHdPathData);
    let finalHdPath = accountHdPath;
    // If there is a parentHdPath, make sure this accountLevel is different from the parent accountLevel
    if (parentHdPath && parentHdPathData.accountLevel) {
      setContinueDisabled(
        updatedAccountHdPathData.accountLevel === parentHdPathData.accountLevel
      );
      // Need to update to resulting HD path.  If we have a parentHdPath, we need the partial pass (not full)
      // eg: parent: m/44'/1'/0', child: m/44'/1'/0'/0'/0', partial: 0'/0'
      // If parent account, split by '/', get length, then cut child from that length
      const parentHdPathLength = parentHdPath.split('/').length;
      finalHdPath = finalHdPath.split('/').splice(parentHdPathLength).join('/');
    }
    setResults(finalHdPath);
  }, [
    accountHdPath,
    setResults,
    setContinueDisabled,
    parentHdPathData,
    parentHdPath,
  ]);

  const changeHDPath = (node: AccountLevel, value: string, hardened?: boolean) => {
    // Did we clear this value out?  If so we need to remove the rest of the path after this value too
    const clearValue = value === null || value === '';
    // Check to see if the value passed in is valid (must be a number or null)
    const validValue = /^[0-9]+$/.test(value) || clearValue;
    // Only make changes if a valid value is passed
    if (validValue) {
      // What position of the path should we change
      const targetNodeIndex = HD_PATH_KEYS.indexOf(node);
      // Split the current path into each value
      const accountHdPathArray = accountHdPath.split('/'); // [m, 44', 505', 0', 0', 0']
      // Are we clearing out the entire node value? (Will clear child nodes too)
      // Everything below that index should be removed
      // eg: m/44'/505'/0'/1'/1' => m/44'/505'/0'//1' => m/44'/505'/0' (removed addressIndex and change)
      if (clearValue) accountHdPathArray.splice(targetNodeIndex);
      // Change the target array value (check for hardened)
      else accountHdPathArray[targetNodeIndex] = `${value}${hardened ? "'" : ''}`;
      // Re-combine to get the full path
      const newAccountHdPath = accountHdPathArray.join('/'); // m/44'/505'/0'/0'/1'
      // Save this value into the state
      setAccountHdPath(newAccountHdPath);
    }
  };

  // Loop over each type of hdpath node to build that row
  const buildAllHdPathNodeRows = (): (JSX.Element | null)[] =>
    HD_PATH_KEYS.map((node, index) => {
      // We want to skip over the root node (no editing root)
      if (node === 'root') return null;
      // Data to use when targetNode doesn't exist (eg: change row for m/44'/505'/0')
      const defaultNodeData = { value: null, hardened: false, display: null };
      const targetNodeData = accountHdPathData[node] || defaultNodeData;
      const { value, hardened } = targetNodeData;
      // Get this hdPath title
      const title = capitalize(node, 'camelcase');
      // Get the previous node and its value (if there is one)
      const previousNode: AccountLevel = HD_PATH_KEYS[index - 1];
      const previousNodeValue = previousNode
        ? accountHdPathData[previousNode]?.value
        : undefined;
      const previousValueEmpty = previousNodeValue === undefined;
      // Check to see if there is a parentHdPath, if there is, all of those parent nodes with values will be disabled
      const parentNodeValue = parentHdPath && parentHdPathData[node]?.value;
      const parentNodeHasValue =
        parentNodeValue !== null && parentNodeValue !== undefined;
      const isDisabled = previousValueEmpty || parentNodeHasValue;
      // Build disabled reason/message
      const disabledMsg = previousValueEmpty
        ? `${capitalize(previousNode, 'camelcase')} value required`
        : parentNodeHasValue
        ? `${capitalize(node, 'camelcase')} value is set by parent account`
        : '';

      return (
        <LineInput
          key={node}
          title={isDisabled ? disabledMsg : `Edit ${title} value`}
          disabled={isDisabled}
        >
          <LineInputTitle>{title}</LineInputTitle>
          <ValueInput
            value={value !== null ? value : ''}
            placeholder="Enter Value"
            onChange={({ target }) => changeHDPath(node, target.value, hardened)}
            disabled={isDisabled}
          />
          <Checkbox
            checked={hardened}
            disabled={isDisabled}
            onChange={(updatedHardened) =>
              changeHDPath(node, `${value}`, updatedHardened)
            }
          />
        </LineInput>
      );
    });

  const parentHasCoinType =
    !!parentHdPath &&
    !!parentHdPathData?.coinType?.value !== null &&
    !!parentHdPathData?.coinType?.value !== undefined;

  return (
    <ScrollContainer paddingBottom="0" height="190px">
      <ListRow>
        <ListContent>Account Level</ListContent>
        <ListContent>{capitalize(accountLevel, 'camelcase')}</ListContent>
      </ListRow>
      <ListRow>
        <ListContent>HD Path</ListContent>
        <ListContent>
          <HDPathText>{accountHdPath}</HDPathText>
        </ListContent>
      </ListRow>
      <DerivationSection>
        <Pill
          disabled={parentHasCoinType} // If parent has a coinType then this is disabled (must match parent)
          data={{
            left: {
              text: 'testnet',
              title: parentHasCoinType
                ? 'Network is set by parent account'
                : 'Set to testnet defaults',
              onClick: () => {
                setAccountHdPath(DEFAULT_TESTNET_HD_PATH);
              },
              active: coinType?.value === TESTNET_WALLET_COIN_TYPE,
            },
            right: {
              text: 'mainnet',
              title: parentHasCoinType
                ? 'Network is set by parent account'
                : 'Set to mainnet defaults',
              onClick: () => {
                setAccountHdPath(DEFAULT_MAINNET_HD_PATH);
              },
              active: coinType?.value === PROVENANCE_WALLET_COIN_TYPE,
            },
          }}
        />
        <Headers>
          <HeadersType>Path Type</HeadersType>
          <HeadersValue>Value</HeadersValue>
          <HeadersHard>Hardened</HeadersHard>
        </Headers>
        {buildAllHdPathNodeRows()}
      </DerivationSection>
    </ScrollContainer>
  );
};
