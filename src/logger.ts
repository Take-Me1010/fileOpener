
import * as vscode from 'vscode';

export const DEBUG = 0;
export const LOG = 10;
export const INFO = 20;
export const WARN = 30;
export const ERROR = 40;
export const CRITICAL = 50;
/**
 * Literals to define the level of logging. the bigger its number is, the less information will show.
 */
export const LEVEL = {
    debug: DEBUG,
    log: LOG,
    info: INFO,
    warn: WARN,
    error: ERROR,
    critical: CRITICAL
} as const;
export type LevelKeys = keyof typeof LEVEL;
export type LevelNumbers = typeof LEVEL[LevelKeys];
const LEVEL_KEYS = Object.keys(LEVEL);
/**
 * a type for logging function
 */
type Logging = (msg: any) => void;
/**
 * an interface to implement Logger
 */
export interface LoggerInterface {
    debug: Logging;
    log: Logging;
    info: Logging;
    warn: Logging;
    error: Logging;
    critical: Logging;
    showInformationMessage: Logging
    showErrorMessage: Logging
}

export function toLevelNumber(level: LevelKeys | LevelNumbers): LevelNumbers {
    if (level in LEVEL_KEYS) {
        return LEVEL[level as LevelKeys];
    }
    return level as LevelNumbers;
}

export class Logger implements LoggerInterface {
    private name: string;
    private level: LevelNumbers;

    constructor(name: string, level: LevelKeys | LevelNumbers) {
        this.name = name;
        this.level = toLevelNumber(level);
    }

    public debug(msg: any) {
        if (this.level <= LEVEL.debug) {
            console.debug(`[${this.name}] [debug] ` + msg);
        }
    }
    public log(msg: any) {
        if (this.level <= LEVEL.log) {
            console.log(`[${this.name}] [debug] ` + msg);
        }
    }

    public info(msg: any) {
        if (this.level <= LEVEL.info) {
            console.info(`[${this.name}] [info] ` + msg);
        }
    }

    public warn(msg: any) {
        if (this.level <= LEVEL.warn) {
            console.warn(`[${this.name}] [warn] ` + msg);
        }
    }

    public error(msg: any) {
        if (this.level <= LEVEL.error) {
            console.error(`[${this.name}] [error] ` + msg);
        }
    }
    
    public critical(msg: any) {
        console.error(`[${this.name}] [critical] ` + msg);
    }

    public showInformationMessage(msg: any) {
        vscode.window.showInformationMessage(msg);
    }

    public showErrorMessage(msg: any) {
        vscode.window.showErrorMessage(msg);
    }
}
