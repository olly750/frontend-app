import { FilterOptions } from '../types';

export function formatQueryParameters(queries?: FilterOptions) {
  let parameters = '';

  if (queries) {
    Object.keys(queries).forEach((key) => {
      // @ts-ignore
      parameters += `${key}=${queries[key]}&`;
    });
    return parameters.substring(0, parameters.length - 1);
  }

  return parameters;
}
