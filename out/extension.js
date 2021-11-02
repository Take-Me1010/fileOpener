"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const logger_1 = require("./logger");
const opener_1 = require("./opener");
function activate(context) {
    const extensionName = "file-opener";
    // TODO: turn logger level (DEBUG) into WARN when publishing
    const logger = new logger_1.Logger(extensionName, logger_1.DEBUG);
    logger.debug(extensionName + " is Activated!");
    const opener = new opener_1.Opener(extensionName, logger);
    const disposalOpen = vscode.commands.registerCommand(`${extensionName}.open`, (selection, selections) => {
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
        }
        else {
            if (fs.statSync(selection.fsPath).isFile()) {
                // 選択がファイルの時
                opener.open(selection);
            }
            else {
                // 選択がディレクトリの時
                //! this code block is never executed now because this callback is called when a file is selected in Explorer/Context or tab of a file.
                //! check "contributes" -> "menus" in package.json
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
        const targetUri = getTargetUriFromSelection(editor);
        if (targetUri) {
            opener.open(targetUri);
        }
        else {
            logger.warn("Selection is None.");
        }
    });
    context.subscriptions.push(disposalOpenFromSelection);
}
exports.activate = activate;
function getTargetUriFromSelection(editor) {
    const currentDocument = editor.document;
    const selection = editor.selection;
    if (selection.isEmpty) {
        return undefined;
    }
    const selectionString = currentDocument.getText(selection);
    let targetPath;
    if (vscode.Uri.parse(selectionString).scheme.includes("http")) {
        return vscode.Uri.parse(selectionString);
    }
    if (path.isAbsolute(selectionString)) {
        // if selection is absolute path
        targetPath = selectionString;
    }
    else {
        // if selection is relative path
        const folder = path.dirname(currentDocument.uri.fsPath);
        targetPath = path.resolve(folder, currentDocument.getText(selection));
    }
    return vscode.Uri.file(targetPath);
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map