export function paramsToObj(
  paramsString: string,
  removePlus = true
): { [key: string]: string } {
  return paramsString
    .replace(/(^\?)/, '')
    .split('&')
    .reduce((acc, param) => {
      const [key, val] = param.split('=');
      if (key && val)
        return {
          ...acc,
          [key]: removePlus
            ? decodeURIComponent(val).replace(/\+/g, ' ')
            : decodeURIComponent(val),
        };
      return acc;
    }, {});
}

export const queryParams = paramsToObj(window.document.location.search);
export const queryParamsWithPlus = paramsToObj(
  window.document.location.search,
  false
);
