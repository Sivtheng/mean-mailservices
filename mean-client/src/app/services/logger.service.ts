import { Injectable } from '@angular/core';

export enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Debug = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private level: LogLevel = LogLevel.Info;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  error(message: string, ...data: any[]) {
    this.log(LogLevel.Error, message, data);
  }

  warn(message: string, ...data: any[]) {
    this.log(LogLevel.Warn, message, data);
  }

  info(message: string, ...data: any[]) {
    this.log(LogLevel.Info, message, data);
  }

  debug(message: string, ...data: any[]) {
    this.log(LogLevel.Debug, message, data);
  }

  private log(level: LogLevel, message: string, data: any[]) {
    if (level <= this.level) {
      const timestamp = new Date().toISOString();
      const levelString = LogLevel[level].toUpperCase();
      console.log(`[${timestamp}] ${levelString}: ${message}`, ...data);
    }
  }
}