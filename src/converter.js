let vscode = require('vscode');

class Converter {
    async convertCommand(selection) {
        let resolving = this.resolving(selection);

        if (resolving === undefined) return vscode.window.showErrorMessage(`No class is selected.`);

        this.replaceClass(resolving);
    }

    resolving(selection) {
        if ((typeof selection) == 'string') return selection;

        let wordRange = this.activeEditor().document.getWordRangeAtPosition(selection.active);

        if (wordRange === undefined) return;

        return this.activeEditor().document.getText(wordRange);
    }

    activeEditor() {
        return vscode.window.activeTextEditor;
    }

    async replaceClass(resolving) {
        const imported = this.getImportLine(resolving);

        if (! imported) return vscode.window.showErrorMessage(`Class ${resolving} is not imported.`);

        const fqcn = imported.text.replace(/use /, '').replace(/ as (\w+)/, '').replace(/;/, '');

        if (imported.text.startsWith('use Facades\\')) {
            return vscode.window.showErrorMessage(`Class ${fqcn} is already a real-time facade.`);
        }

        await this.activeEditor().edit(textEdit => {
            const range = new vscode.Range(imported.line, 0, imported.line, imported.text.length);
            const newText = imported.text.replace(/^use /, 'use Facades\\');
            textEdit.replace(range, newText);
        });

        vscode.window.showInformationMessage(`Class ${fqcn} has been converted to a real-time facade.`);
    }

    getImportLine(className) {
        for (let line = 0; line < this.activeEditor().document.lineCount; line++) {
            let text = this.activeEditor().document.lineAt(line).text;

            if (text.startsWith('use ')) {
                const match = text.match(/(\w+?);/);
                if (match[1] === className) return { line, text }
            }
        }

        return false;
    }
}

module.exports = Converter;
