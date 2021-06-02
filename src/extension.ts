// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';
import { Logger, DEBUG } from "./logger";
import { Opener } from './opener';


export function activate(context: vscode.ExtensionContext) {
	const extensionName = "file-opener";
	const logger = new Logger(extensionName, DEBUG);
	logger.debug(extensionName + " is Activated!");
	const opener = new Opener(extensionName, logger);

	const disposalOpen = vscode.commands.registerCommand(`${extensionName}.open`,
	(selection: vscode.Uri|undefined, selections: vscode.Uri[]) => {
		logger.debug(`called ${extensionName}.open, args are ${selection}, ${selections}`);
		// when called from editor/title
		if (selection === undefined) {
			const editor = vscode.window.activeTextEditor;
			if (editor === undefined) {
				vscode.window.showErrorMessage("failed to get an active editor.");
				return;
			}
			const targetUri = editor.document.uri;
			opener.open(targetUri);

		// when called from explore
		} else {
			if (fs.statSync(selection.fsPath).isFile()) {
				// 選択がファイルの時
				opener.open(selection);
			} else {
				// 選択がディレクトリの時

			}
		}

	});

	context.subscriptions.push(disposalOpen);

	const disposalOpenFromSelection = vscode.commands.registerCommand(`${extensionName}.openFromSelection`, () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			vscode.window.showErrorMessage("failed to get an active editor.");
			return;
		}

		const currentDocument = editor.document;
		const selection = editor.selection;
		
		if (selection.isEmpty) {

			return;
		}

		const targetPath = path.resolve(currentDocument.uri.fsPath, currentDocument.getText(selection));

	});

	// context.subscriptions.push(disposalOpenFromSelection);

}

// this method is called when your extension is deactivated
export function deactivate() {}
