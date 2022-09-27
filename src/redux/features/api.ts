import axios, { Method } from 'axios';

type Request = {
  config?: object;
  data?: object;
  method?: Method;
  url: string;
};

export class Xhr {
  baseURL = window.location.hostname;
  timeout = 45000;
  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: '',
  };
  withCredentials = true;

  xhrSetHeaders = (value: any) => (this.headers = value);
  xhrSetToken = (value: string) => (this.headers.Authorization = `Bearer ${value}`);

  _errorHandling(error: any) {
    if (error.response) {
      return error.response.data;
    }

    if (error.request) {
      console.error(`Unexpected request error ${error.request}`, error); // eslint-disable-line no-console
    }

    // eslint-disable-next-line no-console
    console.error(
      `Something happened setting up the request ${error.message}`,
      error
    );

    return null;
  }

  api = async ({ config, data, method = 'GET', url }: Request) => {
    try {
      const result = await axios(url, {
        timeout: this.timeout,
        headers: { ...this.headers },
        withCredentials: this.withCredentials,
        ...config,
        data,
        method,
      });

      return Promise.resolve({
        data: result.data,
        responseHeaders: { ...result.headers },
      });
    } catch (error) {
      console.error({ error });
      return Promise.reject(this._errorHandling(error));
    }
  };
}

export const { api } = new Xhr();
