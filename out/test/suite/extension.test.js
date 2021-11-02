"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
const logger_1 = require("../../logger");
const opener_1 = require("../../opener");
// import * as myExtension from '../../extension';
suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    const name = "file-opener";
    const opener = new opener_1.Opener(name, new logger_1.Logger(name, logger_1.LEVEL.debug));
    test('test opener.getExecutor with several settings', () => {
        const settings = vscode.workspace.getConfiguration(name);
        settings.update("executorMapByExtension", { ".png": "paintDotNet" }).then(() => {
            const executor = opener["getExecutor"](".png");
            assert.strictEqual(executor, "paintDotNet");
        });
        settings.update("executorMapByExtension", {}).then(() => {
            const executor = opener["getExecutor"](".png");
            assert.strictEqual(executor, undefined);
        });
    });
});
//# sourceMappingURL=extension.test.js.map