const vscode = require('vscode');
const Converter = require('./converter');

function activate(context) {
	const converter = new Converter;

	context.subscriptions.push(
		vscode.commands.registerCommand('laravel-real-time-facades.convert', async function () {
			let selections = vscode.window.activeTextEditor.selections;

            for (let i = 0; i < selections.length; i++) {
                await converter.convertCommand(selections[i]);
            }
		})
	);
}

module.exports = { activate }
