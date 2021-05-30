// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as vscode from 'vscode';
import { Opener } from './opener';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "open-paint-dot-net" is now active!');
	const opener = new Opener();


	vscode.commands.executeCommand('setContext', 'ext.acceptFolders', [
		"image",
		"images",
		"resource",
		"resources"
	]);

	const openImageDisposal = vscode.commands.registerCommand('open-paint-dot-net.openImage', (selection: vscode.Uri|undefined, selections: vscode.Uri[]) => {
		// console.log("file: " + file);
		// console.log("files: " + files);

		// editor/titleから呼び出した時
		if (selection === undefined) {
			const editor = vscode.window.activeTextEditor;
			if (editor === undefined) {
				vscode.window.showErrorMessage("failed to get an active editor.");
				return;
			}
			const targetUri = editor.document.uri;
			opener.openImage(targetUri);
		// exploreから呼び出した時
		} else {
			if (fs.statSync(selection.fsPath).isFile()) {
				opener.openImages(selections);
			} else {
				opener.openPaintDotNet();
			}
		}

	});

	context.subscriptions.push(openImageDisposal);

}

// this method is called when your extension is deactivated
export function deactivate() {}
