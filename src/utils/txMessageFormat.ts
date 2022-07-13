import { getJSType } from './getJSType';

/*

  AddMarker Example: {
    "typeName": "MsgGeneric",
    "amount": {
        "denom": "July13_01",
        "amount": "1"
    },
    "manager": "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
    "fromAddress": "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
    "status": 2,
    "markerType": 1,
    "accessListList": [
        {
            "address": "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
            "permissionsList": [
                6,
                2,
                1,
                3,
                4,
                5
            ]
        }
    ],
    "supplyFixed": true,
    "allowGovernanceControl": false
}

*/
type AmountList = { denom: string, amount: string }[];
type Address = string;
interface MessageObject { [fieldName: string]: any };

type FieldValue = MessageObject | Address | number | AmountList;
type FormatFieldTypes = 'amount' | 'address';

// Special fields need to have their values formatted for better UI display
const formatField = (type: FormatFieldTypes, value: FieldValue) => {};

export const txMessageFormat = (messageShape: MessageObject) => {
  const finalMessage = {} as MessageObject;
  // Loop to pull all values out
  const pullValues = (obj: MessageObject, targetKey?: string, indexLabel?: number) => {
    const allObjKeys = Object.keys(obj);
    allObjKeys.forEach((objKey) => {
      const objValue = obj[objKey];
      const objJSType = getJSType(objValue);
      // Value is not an object or array
      // { messageKey: string } | { messageKey: number }
      const keyName = targetKey || objKey;
      const keyValue = !!indexLabel ? `${keyName} ${indexLabel}` : keyName;
      if (objJSType !== 'array' && objJSType !== 'object') {
        if (targetKey) {
          // Clone existing object
          finalMessage[keyValue] = { ...finalMessage[keyValue] };
          // Add additional vlaue
          finalMessage[keyValue][objKey] = objValue
        } else finalMessage[objKey] = objValue;
      }
      // Value is an array []
      // { messageKey: [1, 2] } | { messageKey: [[1, 2], [1, 2]] } | { messageKey: [{a: 1}, {a: 2}] }
      if (objJSType === 'array') {
        const multiItem = objValue.length > 1;
        objValue.forEach((arrayVal: any, index: number) => {
          pullValues(arrayVal, keyValue, multiItem ? index + 1 : undefined);
        });
      }
      // Value is an object {}
      // { messageKey: {a: 1} } | { messageKey: {a: {b: 1}} } | { messageKey: {a: [1, 2]} }
      if (objJSType === 'object') { pullValues(objValue); }
    })
  };
  pullValues(messageShape);

  return finalMessage;
};

/*
  { a: 1 } => { a: 1 }
  // When an array only has one item, label it w/o the number
  { a: [{ b: 1, c: 1}] } => { a: { b: 1, c: 1 }}
  // When an array has multiple items, split each out into an index key value
  { a: [{ b:1, c:1}, { b:2, c:2 }] } => { a1: { b:1, c:1 }, a2: { b:2, c:2}}
  // Objects stay as objects | When we render we will make a new category for all things under an object (needed for arrays above)
  { a: { b: 1 }} => { a: { b: 1 }}
  .. 
  special cases can get extra formatting
  everything else needs to be json stringified just incase it's still an object (to prevent errors)
*/