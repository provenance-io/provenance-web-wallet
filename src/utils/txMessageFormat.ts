import { getJSType } from './getJSType';
import { trimAddress } from './trimString';
import { hashFormat } from './hashFormat';

interface Amount { denom: string, amount: string };
type AmountList = Amount[];
interface MessageObject { [fieldName: string]: any };

type FieldValue = MessageObject | string | number | AmountList;

// Special fields need to have their values formatted for better UI display
const formatField = (fieldKey: string, fieldValue: FieldValue): FieldValue => {
  switch (fieldKey) {
    // Account address trimed to (3...8)
    case 'address': // fallthrough
    case 'manager': // fallthrough
    case 'fromAddress': // fallthrough
    case 'toAddress': // fallthrough
      return trimAddress(fieldValue as string);
    // amountList is an array of objects: amountList: [{ denom: 'a', amount: '1' }, {...}]
    // Note: If the denom is nhash, autoconvert to hash
    case 'amountList': 
      return (fieldValue as AmountList)
        .map(({amount, denom}) => `${denom === 'nhash' ?
          `${hashFormat(amount)} Hash` :
          `${amount} ${denom}`}`
        );
    case 'amount': {
      const { denom, amount } = fieldValue as Amount;
      return `${denom === 'nhash' ? `${hashFormat(amount)} Hash` : `${amount} ${denom}`}`;
    }
    // No matches, just return what was passed in
    default: return fieldValue;
  }
};

export const txMessageFormat = (messageShape: MessageObject) => {
  const finalMessage = {} as MessageObject;

  // Loop to pull all values out of object, formatting as needed
  const pullValueLoop = (obj: MessageObject, parentFieldKey?: string) => {
    // Gather all the fields to loop over
    const allObjFields = Object.keys(obj);
    allObjFields.forEach((currentField) => {
      // Certain fields are spefically formatted based on their name
      const currentFieldValue = formatField(currentField, obj[currentField]);
      // What type is the current value we're looking at
      const currentFieldValueJSType = getJSType(currentFieldValue);
      // No more looping (non array/obj), just write to finalMessage object
      if (currentFieldValueJSType !== 'array' && currentFieldValueJSType !== 'object') {
        parentFieldKey ? finalMessage[parentFieldKey][currentField] = currentFieldValue :
        finalMessage[currentField] = currentFieldValue;
      };

      // Value is an array []
      if (currentFieldValueJSType === 'array') {
        const currentFieldValueArray = (currentFieldValue as any[]);
        // Determine if we need to display multiple items from the array
        const multiItem = currentFieldValueArray.length > 1;
        // End the loop if array consists of strings or numbers
        const endLoop = !currentFieldValueArray.find(val => getJSType(val) !== 'string' && getJSType(val) !== 'number');
        // Array is all string/numbers (combine and display)
        if (endLoop) {
          const currentFieldCombinedValue = currentFieldValueArray.join(`\n`);
          parentFieldKey ? finalMessage[parentFieldKey][currentField] = currentFieldCombinedValue :
          finalMessage[currentField] = currentFieldCombinedValue;
        } else { // Array needs additional looping (object/array children)
          currentFieldValueArray.forEach((cfArrayVal: any, index: number) => {
            const newCfName = `${multiItem ? `${currentField} ${index + 1}` : currentField}`;
            finalMessage[newCfName] = {};
            pullValueLoop(cfArrayVal, newCfName);
          });
        }
      };

      // Value is an object {}
      if (currentFieldValueJSType === 'object') {
        // Create this entry in the finalMessage, then repeat loop targeting it
        finalMessage[currentField] = {};
        pullValueLoop(currentFieldValue as MessageObject, currentField);
      };
    })
  };
  pullValueLoop(messageShape);
  console.log('finalMessage :', finalMessage);

  return finalMessage;
};
