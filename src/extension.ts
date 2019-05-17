// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

// returns true if file was actually created
async function createFileIfDoesNotExist(fileName: string) {
	return new Promise<boolean>((resolve, reject) => {
		fs.access(fileName, fs.constants.F_OK, (err) => {
			if (err) {
				// file does not exist
				fs.writeFile(fileName,  '0', 'utf8', (err) => {
					if (err) {
						console.log('File is not updatable:', fileName);
						return reject(err);
					}
					return resolve(true);
				});
			} else {
				// file exists, we're done
				return resolve(false);
			}
		});
	});

}

async function getAndIncrementCounter() {
	const counterFileName = path.join(process.env['HOME'] || '.','vscode-locerr-counter.txt');

	return new Promise<Number>(async (resolve, reject) => {
		const wasCreated = await createFileIfDoesNotExist(counterFileName);
		if (wasCreated) {
			console.log('Counter file created:', counterFileName);
		}

		fs.access(counterFileName, fs.constants.W_OK, (err) => {
			if (err) {
				console.log('File is not writable:', counterFileName);
				return reject(err);
			}
			fs.readFile(counterFileName, 'utf8', (err, data) => {
				if (err) {
					console.log('File is not readable:', counterFileName);
					return reject(err);
				}
				const counter = parseInt(data, 10);
				const newCounter = counter + 1;
				const newData = `${newCounter}`;
				fs.writeFile(counterFileName,  newData, 'utf8', (err) => {
					if (err) {
						console.log('File is not updatable:', counterFileName);
						return reject(err);
					}
					return resolve(counter);
				});
			});
		});
	});
}

function replaceEditorSelection(text: string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.log('No editor found');
		return;
	}
  const selections = editor.selections;

  editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      editBuilder.replace(selection, '');
      editBuilder.insert(selection.active, text);
    });
  });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "locerr" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.locerr', async () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No open text editor');
			return; // No open text editor
		}
		// The code you place here will be executed every time your command is executed
		const counter = await getAndIncrementCounter();
		const logStatement = "log.error({ err, location: "+counter+" }, 'error');";

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!:' + counter);
		replaceEditorSelection(logStatement);
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from locerr!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
