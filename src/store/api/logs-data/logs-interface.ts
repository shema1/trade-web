 
export enum LogLevel {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface GetLogsParams {
  level?: LogLevel;
  message?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LogsResponse {
  items: Log[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Log {
  _id: string;
  taskId: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  timestamp: string;
  metadata?: object;
}
