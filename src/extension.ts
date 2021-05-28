// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';

class OpenPaintDotNet {
	private config: vscode.WorkspaceConfiguration;
	private channel: vscode.OutputChannel;
	private executor: string;

	constructor() {
		this.config = vscode.workspace.getConfiguration('openPaintDotNet');

		this.channel = vscode.window.createOutputChannel("openPaintNet");
	}

	openImage(img: string) {
		const executor: string|undefined = this.config.get('openPaintDotNet.executor-path');

		if (executor === undefined) {
			throw new Error("cannot find the path of paintDotNet.exe.");
		}

		const input: string = `${executor} ${img}`;
		child_process.exec(input, (error, stdout, stderror) => {
			this.channel.appendLine(stdout);
			this.channel.appendLine(stderror);
		});
	}

}

export function activate(context: vscode.ExtensionContext) {

	const openPaintDotNet = new OpenPaintDotNet();

	context.subscriptions.push(
		vscode.commands.registerCommand('openPaintDotNet.openImage', (fileUri: vscode.Uri) => {
			openPaintDotNet.openImage(fileUri.path);
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
