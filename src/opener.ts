import * as path from 'path';
import * as fs from "fs";
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { Logger } from "./logger";

interface Dict {
    [key: string]: string
}

class ExtensionError implements Error {
    public name: string = "ExtensionError";
    constructor(public message: string) {

    }

    /**
     * @overwrite
     */
    toString(): string {
        return `[${this.name}] ${this.message}`;
    }
}

export class Opener {
    public name: string;
    private logger: Logger;
    private terminal: vscode.Terminal | undefined;
    
    private config: vscode.WorkspaceConfiguration | undefined;

    constructor(name: string, logger: Logger) {
        this.name = name;
        this.logger = logger;
        
        this.terminal = undefined;
        this.config = undefined;
    }

    /**
     * initialize some attributes when a command of this extension is called.
     */
    private initialize() {
        this.config = vscode.workspace.getConfiguration(this.name);
    }

    /**
     * 
     * @param ext 拡張子名。'.png'など。
     * @returns executorを返す。undefinedは登録されていない拡張子の時。
     */
    private getExecutor(ext: string): string | undefined {
        const executorAliasDict: Dict | undefined = this.config?.get('executorAliasDict');
        let executorMapByExtension: Dict | undefined | null = this.config?.get('executorMapByExtension');

        if (executorMapByExtension === undefined || executorMapByExtension === null) {
            this.logger.warn(`${ext}: no executor found.`);
            return undefined;
        }

        let executor: string | undefined = executorMapByExtension[ext];
        if (executor === undefined) {
            this.logger.warn(`${ext}: no executor set.`);
            return undefined;
        }

        if (executorAliasDict === undefined) {
            this.logger.debug("no alias found.");
        } else {
            const alias: string | undefined = executorAliasDict[executor];
            // if an alias of the executor exists, assign its value into executor.
            if (alias) {
                executor = alias;
                this.logger.debug(`${ext}: alias found; ${alias}`);
            } else {
                this.logger.debug(`${ext}: no alias found.`);
            }
        }

        return executor;
    }

    private execInChildProcess(command: string, successHandler: (stdout: string) => void, failureHandler: (error: child_process.ExecException, stdout: string, stderr: string) => void) {
       child_process.exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
           if (error) {
               failureHandler(error, stdout, stderr);
           } else {
               successHandler(stdout);
           }
       });
    }

    private execInTerminal(command: string) {
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
    public open(file: vscode.Uri) {
        // update this.config
        this.initialize();

        const filePath: string = file.fsPath;
        const ext: string = path.extname(filePath);
        let filePathToOpen: string;
        let executor: string | undefined = this.getExecutor(ext);
        
        if (file.scheme.includes("http")) {
            // if http or https
            filePathToOpen = file.toString();
            
        } else if (fs.existsSync(file.fsPath)) {
            // if local file
            filePathToOpen = filePath;
        } else {
            this.logger.showErrorMessage(`The file ${filePath} does not exist or invalid.`);
            return;
        }

        // 値の置換
        let foundFileNameInExecutor = false;
        if (executor && executor.includes("$fileName")) {
            foundFileNameInExecutor = true;
            executor = executor.replace("$fileName", filePathToOpen);
        } else if (executor === undefined) {
            const defaultCommand: string | undefined = this.config?.get("commandToOpenDefaultApp");
            if (defaultCommand === undefined) {
                executor = "start";
            } else {
                executor = defaultCommand;
            }
        }

        const command = (foundFileNameInExecutor)? executor : executor + " " + filePathToOpen ;

        this.logger.debug(`Send command ${command}`);

        if (this.config?.get("executeInTerminal")) {
            this.execInTerminal(command);
        } else {
            const successHandler = (stdout: string) => {
                const msg = `successfully opened ${filePathToOpen}`;
                this.logger.info(msg);
            };
    
            const failureHandler = (error: child_process.ExecException, stdout: string, stderr: string) => {
                const msg = `failed to open ${filePath}.`;
                this.logger.error(msg);
                this.logger.error(error);
                this.logger.error("stdout: " + stdout);
                this.logger.error("stderr: " + stderr);
                this.logger.showErrorMessage(msg);
            };
    
            this.execInChildProcess(command, successHandler, failureHandler);
        }

    }

}
