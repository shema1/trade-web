/* eslint-disable @typescript-eslint/no-explicit-any */
export enum LogLevel {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface CreateLogDto {
  message: string;
  level: LogLevel;
  taskId?: string;
  metadata?: any;
  timestamp: Date;
}

export interface Log {
  _id: string;
  taskId: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  timestamp: string;
  metadata?: object;
}
