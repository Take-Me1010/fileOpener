"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LEVEL = exports.CRITICAL = exports.ERROR = exports.WARN = exports.INFO = exports.LOG = exports.DEBUG = void 0;
const vscode = require("vscode");
exports.DEBUG = 0;
exports.LOG = 10;
exports.INFO = 20;
exports.WARN = 30;
exports.ERROR = 40;
exports.CRITICAL = 50;
/**
 * Literals to define the level of logging. the bigger its number is, the less information will show.
 */
exports.LEVEL = {
    debug: exports.DEBUG,
    log: exports.LOG,
    info: exports.INFO,
    warn: exports.WARN,
    error: exports.ERROR,
    critical: exports.CRITICAL
};
class Logger {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }
    debug(msg) {
        if (this.level <= exports.LEVEL.debug) {
            console.debug(`[${this.name}] [debug] ` + msg);
        }
    }
    log(msg) {
        if (this.level <= exports.LEVEL.log) {
            console.log(`[${this.name}] [debug] ` + msg);
        }
    }
    info(msg) {
        if (this.level <= exports.LEVEL.info) {
            console.info(`[${this.name}] [info] ` + msg);
        }
    }
    warn(msg) {
        if (this.level <= exports.LEVEL.warn) {
            console.warn(`[${this.name}] [warn] ` + msg);
        }
    }
    error(msg) {
        if (this.level <= exports.LEVEL.error) {
            console.error(`[${this.name}] [error] ` + msg);
        }
    }
    critical(msg) {
        console.error(`[${this.name}] [critical] ` + msg);
    }
    showInformationMessage(msg) {
        vscode.window.showInformationMessage(msg);
    }
    showErrorMessage(msg) {
        vscode.window.showErrorMessage(msg);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map