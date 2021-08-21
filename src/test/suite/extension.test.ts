import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { LEVEL, Logger } from '../../logger';
import { Opener } from '../../opener';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	const name = "file-opener";
	const opener = new Opener(name, new Logger(name, LEVEL.debug));


	test('test opener.getExecutor with several settings', () => {
		const settings = vscode.workspace.getConfiguration(name);

		settings.update("executorMapByExtension", {".png": "paintDotNet"}).then(() => {
			const executor = opener["getExecutor"](".png");
			assert.strictEqual(executor, "paintDotNet");
		});

		settings.update("executorMapByExtension", {}).then(() => {
			const executor = opener["getExecutor"](".png");
			assert.strictEqual(executor, undefined);
		});

	});
});
