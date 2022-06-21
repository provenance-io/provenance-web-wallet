import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {
  DEFAULT_NETWORK,
  TESTNET_NETWORK,
  MAINNET_NETWORK,
  TESTNET_WALLET_COIN_TYPE,
  PROVENANCE_WALLET_COIN_TYPE,
} from 'consts';
import { Pill as PillBase } from 'Components/Pill';
import { Checkbox as BaseCheckbox } from 'Components/Checkbox';
import { COLORS } from 'theme';
import { AccountLevel, HDPathData } from 'types';
import { getHDPathData } from 'utils';

interface StyledProps {
  disabled?: boolean,
}

const AdvancedSection = styled.div`
  padding-bottom: 40px;
`;
const AdvancedTextButton = styled.div`
  color: #357EFD;
  font-weight: bold;
  margin: 20px 0;
  cursor: pointer;
  user-select: none;
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
  ${({ disabled }) => disabled && `
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
  &:active, &:focus {
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

interface HDPathItem {
  display?: string,
  value?: string | null,
  hardened?: boolean,
  disabled?: boolean,
}
type HDPathLevels = 'purpose' | 'coinType' | 'account' | 'change' | 'addressIndex';
type HDPathArrayType = HDPathLevels[];
interface HDPathShape {
  purpose: HDPathItem,
  coinType: HDPathItem,
  account: HDPathItem,
  change: HDPathItem,
  addressIndex: HDPathItem,
}
type NetworkType = typeof TESTNET_NETWORK | typeof MAINNET_NETWORK;
interface Props {
  setResults: (hdPath: string) => void,
  parentHdPath?: string,
}

export const AdvancedSettings:React.FC<Props> = ({ setResults, parentHdPath }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Get the parent HDPath values to prefill/disable certain nodes
  const getDefaultHDPath = (network: NetworkType = DEFAULT_NETWORK): HDPathShape => {
    // If a parentHdPath is provided, we need to use it and limit what the user can edit/change
    const parentHdData = parentHdPath ? getHDPathData(parentHdPath) : {} as HDPathData;
    const defaultHdData = {
      purpose: { value: '44', hardened: true, disabled: false },
      coinType: { value: network === MAINNET_NETWORK ? PROVENANCE_WALLET_COIN_TYPE : TESTNET_WALLET_COIN_TYPE, hardened: true, disabled: false },
      account: { value: '0', hardened: true, disabled: false },
      change: { value: null, hardened: false, disabled: false },
      addressIndex: { value: null, hardened: false, disabled: false },
    };
    // Use parentHdPath when available, else use the default path
    const finalHdData = {
      purpose: parentHdData?.purpose || defaultHdData.purpose,
      coinType: parentHdData?.coinType || defaultHdData.coinType,
      account: parentHdData?.account || defaultHdData.account,
      change: parentHdData?.change || defaultHdData.change,
      addressIndex: parentHdData?.addressIndex || defaultHdData.addressIndex,
    }
    console.log('parentHdData :', parentHdData);
    console.log('defaultHdData :', defaultHdData);
    console.log('finalHdData :', finalHdData);
    return({
      purpose: {
        display: 'Purpose',
        value: finalHdData.purpose.value ? `${finalHdData.purpose.value}` : null,
        hardened: finalHdData.purpose.hardened,
        disabled: !!finalHdData?.purpose.value,
      },
      coinType: {
        display: 'Coin Type',
        value: finalHdData.coinType.value ? `${finalHdData.coinType.value}` : null,
        hardened: finalHdData.coinType.hardened,
        disabled: !!finalHdData?.coinType.value,
      },
      account: {
        display: 'Account',
        value: finalHdData.account.value ? `${finalHdData.account.value}` : null,
        hardened: finalHdData.account.hardened,
        disabled: !!finalHdData?.account.value,
      },
      change: {
        display: 'Change',
        value: finalHdData.change.value ? `${finalHdData.change.value}` : null,
        hardened: finalHdData.change.hardened,
        disabled: !!finalHdData?.change.value,
      },
      addressIndex: {
        display: 'Address Index',
        value: finalHdData.addressIndex.value ? `${finalHdData.addressIndex.value}` : null,
        hardened: finalHdData.addressIndex.hardened,
      },
    })
  }
  // const getDefaultHDPath = (network: NetworkType = DEFAULT_NETWORK): HDPathShape => ({
  //   purpose: { display: 'Purpose', value: '44', hardened: true },
  //   coinType: { display: 'Coin Type', value: `${network === MAINNET_NETWORK ? PROVENANCE_WALLET_COIN_TYPE : TESTNET_WALLET_COIN_TYPE}`, hardened: true },
  //   account: { display: 'Account', value: '0', hardened: true },
  //   change: { display: 'Change', value: null, hardened: false },
  //   addressIndex: { display: 'Address Index', value: null, hardened: false },
  // })
  const buildFullHDPath = (newHDPath: HDPathShape) => {
    const { purpose, account, change, coinType, addressIndex } = newHDPath;
    console.log('buildFullHdPath() | newHDPath: ', newHDPath);
    const ifExists = (item: HDPathItem) => item.value !== null ? `/${item.value}${item.hardened ? "'" : ''}`:'';

    return `m${ifExists(purpose)}${ifExists(coinType)}${ifExists(account)}${ifExists(change)}${ifExists(addressIndex)}`;
  };
  const [HDPath, setHDPath] = useState<HDPathShape>(getDefaultHDPath(DEFAULT_NETWORK));
  console.log('HDPath: ', HDPath);
  const [finalHDPath, setFinalHDPath] = useState(buildFullHDPath(HDPath));
  console.log('finalHDPath :', finalHDPath);
  const allHDTypeRows:HDPathArrayType = ['purpose', 'coinType', 'account', 'change', 'addressIndex'];
  const activeNetwork = 
    HDPath.coinType.value === `${PROVENANCE_WALLET_COIN_TYPE}` ? MAINNET_NETWORK :
    HDPath.coinType.value === `${TESTNET_WALLET_COIN_TYPE}` ? TESTNET_NETWORK : 'unknown';  

  useEffect(() => {
    // Whenever the finalHDPath changes, update any components listening through thr setResults callback
    setResults(finalHDPath);
  }, [finalHDPath, setResults]);


  const getAccountLevel = () => {
    let accountType = 'Root';
    allHDTypeRows.forEach(type => {
      const { value, display } = HDPath[type];
      if (value !== null) accountType = display!;
    });

    return accountType as AccountLevel;
  };

  const updateHDPath = (newPath: HDPathShape) => {
    // Update State
    setHDPath(newPath);
    setFinalHDPath(buildFullHDPath(newPath));
  }

  const toggleShowAdvanced = () => {
    if (showAdvanced) {
      const newPath = getDefaultHDPath(DEFAULT_NETWORK);
      // Update State
      updateHDPath(newPath);
      // Close menu
      setShowAdvanced(false);
    }
    else setShowAdvanced(true);
  }
  
  const setToDefaultHDPath = (network: NetworkType) => {
    const newPath = getDefaultHDPath(network);
    // Update State
    updateHDPath(newPath);
  }

  const changeHDPath = (target: HDPathLevels, data: HDPathItem) => {
    const { value, hardened } = data;
    const { value: ogValue, hardened: ogHardened, display: ogDisplay } = HDPath[target];
    // If value is passed in, check for numberical 0-9
    const validValue = (value && /^[0-9]+$/.test(value)) || value === '';
    const finalValue = value === '' ? null : value;
    // If it's valid, use the new value, or else keep the old existing value
    // Note, cannot set hardened value unless value is valid
    const newTargetData = {
      value: validValue ? finalValue : ogValue,
      hardened: (hardened !== undefined) ? hardened : ogHardened,
      display: ogDisplay,
    }
    // Update whole HD Path object
    const newHDPath = { ...HDPath };
    newHDPath[target] = newTargetData;
    // Update state
    updateHDPath(newHDPath);
  };

  const buildHDTypeRow = (type: HDPathLevels, index: number): JSX.Element => {
    const { display, value, hardened, disabled } = HDPath[type];
    const previousHDType: AccountLevel = allHDTypeRows[index - 1];
    const { value: previousValue } = HDPath[previousHDType];
    let title = display;
    // Either field is flat out disabled, or previous value is null (other than purpose)
    const isDisabled = disabled || (index > 0 && previousValue === null);
    const useValue = value === null ? '' : value;
    console.log('value :', value);
    console.log('previousValue :', previousValue);
    console.log('useValue :', useValue);
    
    return (
      <LineInput key={type} disabled={isDisabled} title={isDisabled ? 'Field disabled' : title}>
        <LineInputTitle>{display}</LineInputTitle>
        <ValueInput
          value={useValue}
          placeholder="Enter Value"
          onChange={({ target }) => changeHDPath(type, { value: target.value })}
          disabled={isDisabled}
        />
        <Checkbox
          checked={hardened}
          onChange={(hardened) => changeHDPath(type, { hardened })}
          disabled={isDisabled}
        />
      </LineInput>
    );
  }

  const buildAllHDTypeRows = (): JSX.Element[] => allHDTypeRows.map((type, index) => buildHDTypeRow(type as HDPathLevels, index));

  return (
    <>
      <AdvancedTextButton onClick={toggleShowAdvanced}>Advanced Settings ({showAdvanced ? 'Enabled' : 'Disabled'})</AdvancedTextButton>
      {showAdvanced && (
        <AdvancedSection>
          <ListRow>
            <ListContent>Account Level</ListContent>
            <ListContent>{getAccountLevel()}</ListContent>
          </ListRow>
          <ListRow>
            <ListContent>HD Path</ListContent>
            <ListContent><HDPathText>{finalHDPath}</HDPathText></ListContent>
          </ListRow>
          <DerivationSection>
            <Pill
              data={{
                left: {
                  text: 'testnet',
                  title: 'Set to testnet defaults',
                  onClick: () => {setToDefaultHDPath(TESTNET_NETWORK)},
                  active: (activeNetwork === TESTNET_NETWORK),
                },
                right: {
                  text: 'mainnet',
                  title: 'Set to mainnet defaults',
                  onClick: () => {setToDefaultHDPath(MAINNET_NETWORK)},
                  active: (activeNetwork === MAINNET_NETWORK),
                },
              }}
            />
            <Headers>
              <HeadersType>Path Type</HeadersType>
              <HeadersValue>Value</HeadersValue>
              <HeadersHard>Hardened</HeadersHard>
            </Headers>
            {buildAllHDTypeRows()}
          </DerivationSection>
        </AdvancedSection>
      )}
    </>
  )
};
