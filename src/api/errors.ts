import { isAxiosError } from 'axios';

type ApiErrorBody = {
  detail?: string | { msg?: string }[];
};

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;

    if (typeof data?.detail === 'string') {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail.map((item) => item.msg ?? 'Error de validación').join(', ');
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error inesperado';
}
