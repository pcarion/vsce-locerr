// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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

interface ExtensionData {
	counter: number;
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

		const globalState = context.globalState;
		const data = globalState.get<ExtensionData>('extension_locerr') || { counter: 0 };

		// The code you place here will be executed every time your command is executed
		const counter = data.counter;
		const logStatement = "log.error({ err, location: "+counter+" }, 'error');";

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!:' + counter);
		replaceEditorSelection(logStatement);

		data.counter = data.counter + 1;
		globalState.update('extension_locerr', data);
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from locerr!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
