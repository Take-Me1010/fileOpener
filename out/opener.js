"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opener = void 0;
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const child_process = require("child_process");
class ExtensionError {
    constructor(message) {
        this.message = message;
        this.name = "ExtensionError";
    }
    /**
     * @overwrite
     */
    toString() {
        return `[${this.name}] ${this.message}`;
    }
}
class Opener {
    constructor(name, logger) {
        this.name = name;
        this.logger = logger;
        this.terminal = undefined;
        this.config = undefined;
        this.channel = vscode.window.createOutputChannel(name);
    }
    /**
     * initialize some attributes when a command of this extension is called.
     */
    initialize() {
        this.config = vscode.workspace.getConfiguration(this.name);
    }
    /**
     *
     * @param ext 拡張子名。'.png'など。
     * @returns executorを返す。undefinedは登録されていない拡張子の時。
     */
    getExecutor(ext) {
        var _a, _b;
        const executorAliasDict = (_a = this.config) === null || _a === void 0 ? void 0 : _a.get('executorAliasDict');
        let executorMapByExtension = (_b = this.config) === null || _b === void 0 ? void 0 : _b.get('executorMapByExtension');
        if (executorMapByExtension === undefined || executorMapByExtension === null) {
            this.logger.warn(`${ext}: no executor found.`);
            return undefined;
        }
        let executor = executorMapByExtension[ext];
        if (executor === undefined) {
            this.logger.warn(`${ext}: no executor set.`);
            return undefined;
        }
        if (executorAliasDict === undefined) {
            this.logger.debug("no alias found.");
        }
        else {
            const alias = executorAliasDict[executor];
            // if an alias of the executor exists, assign its value into executor.
            if (alias) {
                executor = alias;
                this.logger.debug(`${ext}: alias found; ${alias}`);
            }
            else {
                this.logger.debug(`${ext}: no alias found.`);
            }
        }
        return executor;
    }
    execInChildProcess(command, successHandler, failureHandler) {
        child_process.exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            if (error) {
                failureHandler(error, stdout, stderr);
            }
            else {
                successHandler(stdout);
            }
        });
    }
    execInTerminal(command) {
        if (this.terminal === undefined) {
            this.terminal = vscode.window.createTerminal(this.name);
        }
        this.terminal.show(false);
        this.terminal.sendText(command);
    }
    /**
     * open the given file corresponding to user settings
     * @param file Uri to open
     */
    open(file) {
        var _a;
        // update this.config
        this.initialize();
        const filePath = file.fsPath;
        const ext = path.extname(filePath);
        let filePathToOpen;
        let executor = this.getExecutor(ext);
        if (file.scheme.includes("http")) {
            // if http or https
            filePathToOpen = file.toString();
        }
        else if (fs.existsSync(file.fsPath)) {
            // if local file
            filePathToOpen = filePath;
        }
        else {
            this.logger.showErrorMessage(`The file ${filePath} does not exist or invalid.`);
            return;
        }
        // 値の置換
        let foundFileNameInExecutor = false;
        if (executor && executor.includes("$fileName")) {
            foundFileNameInExecutor = true;
            executor = executor.replace("$fileName", filePathToOpen);
        }
        else if (executor === undefined) {
            // TODO: Macならopenコマンド！！
            executor = "start";
        }
        const command = (foundFileNameInExecutor) ? executor : executor + " " + filePathToOpen;
        this.logger.debug(`Send command ${command}`);
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.get("executeInTerminal")) {
            this.execInTerminal(command);
        }
        else {
            const successHandler = (stdout) => {
                const msg = `successfully opened ${filePathToOpen}`;
                this.logger.info(msg);
                this.channel.appendLine(msg);
            };
            const failureHandler = (error, stdout, stderr) => {
                const msg = `failed to open ${filePath}.`;
                this.logger.error(msg);
                this.logger.error(error);
                this.logger.error("stdout: " + stdout);
                this.logger.error("stderr: " + stderr);
                this.channel.appendLine(msg + "See debug console.");
                vscode.window.showErrorMessage(msg);
            };
            this.execInChildProcess(command, successHandler, failureHandler);
        }
    }
}
exports.Opener = Opener;
//# sourceMappingURL=opener.js.map