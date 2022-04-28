'use strict';

import internal = require('stream');
import * as vscode from 'vscode';
import * as moment from 'moment';

const regex_todo = /^\s*[-*] \[ \].*$/;
const regex_task_done = /^\s*[-*] \[[xX]\].*$/;
const regex_task_canceled = /^\s*[-*] \[[-]\].*$/;
// A valid task ... but its not in a todo state ...
const regex_not_todo = /^\s*[-*] \[[^ ]\].*$/;
const regex_task = /[-*] \[.\]/;
const regex_emptyline = /^\s*$/;
const regex_done = / @done\([^)]+\)/;
const regex_capturing_preceding_whitespace = /(\s*)(.*)/;
const regex_has_schedule = / >\d{4}-\d{2}-\d{2}/;
const regex_capturing_schedule = / >(\d{4}-\d{2}-\d{2})(.*)/;


function zeroPad(num:string, places:number):string {
	return String(num).padStart(places, '0');
}

// function get_iso8601_datetime(local:Date): string {
// 	// https://stackoverflow.com/questions/43341823/javascript-date-to-string-with-iso-format-with-timezone
// 	// https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
//     const s = local.toLocaleString('en-US');
//     const a = s.split(/\D/);
// 	const offset = local.getTimezoneOffset() / 60;
//     return a[2] + '-' + zeroPad(a[0], 2) + '-' + zeroPad(a[1], 2) + 'T' + zeroPad(a[4], 2) + ':' + zeroPad(a[5], 2) + ':' + zeroPad(a[6], 2) + "-" + zeroPad(String(offset), 2) + ":00";
// }

function copy_uri_to_clipboard() {
	// Go from  ..
	// 	file:///Users/omareid/Workspace/git/plugins/vscode/flavorfultasks/Makefile
	// to ...
	// 	vscode://file/Users/omareid/Workspace/git/plugins/vscode/flavorfultasks/Makefile

	// Get the active text editor
	// https://code.visualstudio.com/api/references/vscode-api#TextEditor
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const uri = document.uri.toString();
		const suffix = `:${editor.selection.active.line}:${editor.selection.active.character}`;
		const xcallback = uri.replace("file://", "vscode://file") + suffix;
		vscode.env.clipboard.writeText(xcallback);
	}
}

function replace_line_at_cursor(line_transformer : (a: string) => string) {
	return function () {
		// Get the active text editor
		// https://code.visualstudio.com/api/references/vscode-api#TextEditor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			const cursor_poition = selection.active;
			const active_line = document.lineAt(cursor_poition);

			const response = line_transformer(active_line.text);

			editor.edit(editBuilder => {
				editBuilder.replace(active_line.range, response);
			});
			
		}
	};
}

function done_handler(task:string) : string {
	// const now = get_iso8601_datetime(new Date());
	const now = moment().format();
	let response = "";

	if (regex_emptyline.test(task)) {
		response = `${task}- [ ]`;
	}
	else if (regex_task_done.test(task)) {
		// Undo a done ...
		const newTask = (
			task
				.replace(regex_task, "- [ ]")
				.replace(regex_done, '')
		);
		response = newTask;
	}
	else if (regex_todo.test(task)) {
		const newTask = (
			task
				.replace(regex_task, "- [x]")
		);
		response = `${newTask} @done(${now})`;
	}
	else if (regex_not_todo.test(task)) {
		response = (
			task
				.replace(regex_task, "- [x]")
				.replace(regex_done, '')
		);
		response = `${response} @done(${now})`;
	}
	else {
		response = task.replace(regex_capturing_preceding_whitespace, "$1- [x]$2");
		response = `${response} @done(${now})`;	
	}
	return response;
}

function create_handler(task:string) : string {
	let response = "";
	if (regex_emptyline.test(task)) {
		response = `${task}- [ ]`;
	}
	else if (regex_not_todo.test(task)) {
		// Flush non todos into todos ...
		const newTask = (
			task
				.replace(regex_task, "- [ ]")
				.replace(regex_done, '')
				// Do a replace all ...
				.replace(regex_capturing_schedule, '$2')
				.replace(regex_capturing_schedule, '$2')
				.replace(regex_capturing_schedule, '$2')
				.replace(regex_capturing_schedule, '$2')
				.replace(regex_capturing_schedule, '$2')
		);
		response = newTask;
	}
	else {
		response = task;
	}
	return response;
}

function cancel_handler(task:string) : string {
	const now = moment().format();
	let response = "";
	if (regex_emptyline.test(task)) {
		response = `${task}- [-]`;
	}
	else if (regex_task_canceled.test(task)) {
		// Undo cancel ...
		const newTask = (
			task
				.replace(regex_task, "- [ ]")
				.replace(regex_done, '')
		);
		response = newTask;
	}
	else if (regex_todo.test(task)) {
		const newTask = (
			task
				.replace(regex_task, "- [-]")
		);
		response = `${newTask} @done(${now})`;
	} 
	else if (regex_not_todo.test(task)) {
		response = (
			task
				.replace(regex_task, "- [-]")
				.replace(regex_done, ` @done(${now})`)
		);
	}
	else {
		response = task;
	}
	return response;
}

function schedule_handler(task:string) : string {
	// const tomorrow = get_iso8601_datetime(moment().add(1, 'days').toDate());
	const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");

	let response = "";

	if (regex_emptyline.test(task)) {
		response = `${task}- [ ] >${tomorrow}`;
	}
	else if (regex_has_schedule.test(task)){
		const left_most_schedule = (task.match(regex_capturing_schedule) as RegExpMatchArray)[0];
		const incremented_date = moment(left_most_schedule, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");
		response = (
			task
				.replace(regex_capturing_schedule, ` >${incremented_date} >$1$2`)
				.replace(regex_task, "- [>]")
				.replace(regex_done, '')
		);
	} 
	else if (regex_task.test(task)) {
		response = (
			task
				.replace(regex_task, "- [>]")
				.replace(regex_done, '')
		);
		response = `${response} >${tomorrow}`;
	}
	else {
		response = (
			task.replace(regex_capturing_preceding_whitespace, "$1- [>]$2")
		);
		response = `${response} >${tomorrow}`;	
	}
	// What to do if a task is done and I am trying to schedule it? Undone it? ...
	return response;
}

export function activate(context: vscode.ExtensionContext) {
	const disposable1 = vscode.commands.registerCommand(
		'extension.TodoMarkDone', 
		replace_line_at_cursor(done_handler)
	);
	const disposable2 = vscode.commands.registerCommand(
		'extension.TodoReschedule', 
		replace_line_at_cursor(schedule_handler)
	);
	const disposable3 = vscode.commands.registerCommand(
		'extension.TodoCreate', 
		replace_line_at_cursor(create_handler)
	);
	const disposable4 = vscode.commands.registerCommand(
		'extension.TodoMarkCanceled', 
		replace_line_at_cursor(cancel_handler)
	);
	const disposable5 = vscode.commands.registerCommand(
		'extension.GetXCallbackURL', 
		copy_uri_to_clipboard
	);
	
	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
	context.subscriptions.push(disposable5);
}

