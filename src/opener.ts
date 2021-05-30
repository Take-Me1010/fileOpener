
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as child_process from 'child_process';

export class Opener {
    private channel: vscode.OutputChannel;

    constructor() {
        this.channel = vscode.window.createOutputChannel("open-paint-dot-net");
    }

    private logging(msg: any) {
        console.log("[open-paint-dot-net]" + msg);
    }

    private getExecutor(): string {
        const config = vscode.workspace.getConfiguration('open-paint-dot-net');
        let executor: string | undefined | null = config.get('executor-path');

        if (executor === undefined || executor === null) {
            console.warn("found no executor. use \"paintDotNet.exe\" instead.");
            executor = 'paintDotNet.exe';
        }

        return executor;
    }

    private exec(command: string, successHandler: (stdout: string) => void, failureHandler: (error: child_process.ExecException, stdout: string, stderr: string) => void) {
       child_process.exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
           if (error) {
               failureHandler(error, stdout, stderr);
           } else {
               successHandler(stdout);
           }
       });
    }


    public openImage(img: vscode.Uri|string) {
        const executor = this.getExecutor();
        // console.log("[open-paint-dot-net] try to open image by " + executor);
        const imagePath = (img instanceof vscode.Uri)? img.fsPath : img;
        const command: string = executor + " " + imagePath;

        this.exec(command, 
            // successHandler
            (stdout) => {
                console.log(`[open-paint-dot-net] Successfully opened image ${imagePath}`);
                this.channel.appendLine(`Successfully open ${imagePath}`);
            },
            // failureHandler
            (error, stdout, stderr) => {
                console.error(`[open-paint-dot-net] failed to open image ${imagePath}`);
                console.error('error: ' + error);
                console.error('stdout: ' + stdout);
                console.error('stderr: ' + stderr);
                vscode.window.showErrorMessage(`failed to open ${imagePath}`);
        });
    }

    public openImages(images: vscode.Uri[]) {
        const executor = this.getExecutor();
        const imagePaths = images.map(file => {
            return "\"" + file.fsPath + "\"";
        });
        const command = executor + " " + imagePaths.join(" ");
        this.exec(command,
            _ => {
                this.logging("Successfully opened: " + imagePaths);
            },
            (error, stdout, stderr) => {
                this.logging(error);
                console.error(stdout);
                console.error(stderr);
                vscode.window.showErrorMessage("failed to open multiple images.");
            }
        );
    }

    public openPaintDotNet() {
        const executor = this.getExecutor();
        this.exec(executor,
            (stdout) => {
                this.logging(`Successfully open ${executor}`);
                this.channel.appendLine(`Successfully open ${executor}`);
            },
            (error, stdout, stderr) => {
                this.logging(`failed to open ${executor}`);
                console.error('error: ' + error);
                console.error('stdout: ' + stdout);
                console.error('stderr: ' + stderr);
                vscode.window.showErrorMessage(`failed to open ${executor}`);
            }
        );
    }

}
