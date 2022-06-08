import { capitalize } from '.';

export const camelToSentence = (str: string) => capitalize(str.replace(/([A-Z])/g, ' $1'));