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
import { AccountLevel } from 'types';

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
}

export const AdvancedSettings:React.FC<Props> = ({ setResults }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const getDefaultHDPath = (network: NetworkType = DEFAULT_NETWORK): HDPathShape => ({
    purpose: { display: 'Purpose', value: '44', hardened: true },
    coinType: { display: 'Coin Type', value: `${network === MAINNET_NETWORK ? PROVENANCE_WALLET_COIN_TYPE : TESTNET_WALLET_COIN_TYPE}`, hardened: true },
    account: { display: 'Account', value: '0', hardened: true },
    change: { display: 'Change', value: null, hardened: false },
    addressIndex: { display: 'Address Index', value: null, hardened: false },
  })
  const buildFullHDPath = (newHDPath: HDPathShape) => {
    const { purpose, account, change, coinType, addressIndex } = newHDPath;
    const ifExists = (item: HDPathItem) => item.value !== null ? `/${item.value}${item.hardened ? "'" : ''}`:'';

    return `m${ifExists(purpose)}${ifExists(coinType)}${ifExists(account)}${ifExists(change)}${ifExists(addressIndex)}`;
  };
  const [HDPath, setHDPath] = useState<HDPathShape>(getDefaultHDPath(DEFAULT_NETWORK));
  const [finalHDPath, setFinalHDPath] = useState(buildFullHDPath(HDPath));
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
    const { display, value, hardened } = HDPath[type];
    let isDisabled = false;
    let title = display;
    // Skip checking first value 'purpose'
    if (index > 0) {
      // Previous row value (check to see if this row is disabled - previous row must have value)
      const previousHDType: AccountLevel = allHDTypeRows[index - 1];
      const { value: previousValue, display: previousDisplay } = HDPath[previousHDType];
      isDisabled = previousValue === null;
      if (isDisabled) title = `${previousDisplay} is required`;
    }
    const useValue = value === null ? '' : value;
    
    return (
      <LineInput key={type} disabled={isDisabled} title={title}>
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
