export interface TErrorSource {
  path: string;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  stack?: string;
  errorSource?: TErrorSource[];
}
