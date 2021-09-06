'use strict';

import internal = require('stream');
import * as vscode from 'vscode';

function zeroPad(num:string, places:number):string {
	return String(num).padStart(places, '0');
}

function get_localized_iso8601_datetime(): string {
	// https://stackoverflow.com/questions/43341823/javascript-date-to-string-with-iso-format-with-timezone
	// https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
	const local = new Date();
    const s = local.toLocaleString('en-US');
    const a = s.split(/\D/);
	const offset = local.getTimezoneOffset() / 60;
    return a[2] + '-' + zeroPad(a[0], 2) + '-' + zeroPad(a[1], 2) + 'T' + zeroPad(a[4], 2) + ':' + zeroPad(a[5], 2) + ':' + zeroPad(a[6], 2) + "-" + zeroPad(String(offset), 2) + ":00";
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.TodoMarkDone', function () {
		// Get the active text editor
		// https://code.visualstudio.com/api/references/vscode-api#TextEditor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			const cursor_poition = selection.active;
			const active_line = document.lineAt(cursor_poition);

			// Get the word within the selection
			// const task = document.getText(selection);
			const task = active_line.text;
			// Make sure it starts with a - [ ]

			const todo_regex = /^\s*- \[ \].*$/;
			const not_todo_regex = /^\s*- \[[^ ]\].*$/;
			const task_regex = /- \[.\]/;
			const emptyline_regex = /^\s*$/;
			const done_regex = / @done\([^)]+\)/;
			const capturing_preceding_whitespace_regex = /(\s*)(.*)/;

			const now = get_localized_iso8601_datetime();
			// const now = new Date();

			let response = "";

			if (emptyline_regex.test(task)) {
				response = `${task}- [ ]`;
			}
			else if (todo_regex.test(task)) {
				response = `${task.replace("- [ ]", "- [x]")} @done(${now})`;
			} 
			else if (not_todo_regex.test(task)) {
				response = `${task.replace(task_regex, "- [ ] ").replace(done_regex, "")}`;

			}
			else {
				response = task.replace(capturing_preceding_whitespace_regex, "$1- [x]$2");
				response = `${response} @done(${now})`;	
			}

			editor.edit(editBuilder => {
				editBuilder.replace(active_line.range, response);
			});
		}
	});

	context.subscriptions.push(disposable);
}