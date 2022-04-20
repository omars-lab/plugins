# flavorfultasks 

*Manager of Markdown Flavored Tasks*

This is my perosnal plugin to manage tasks in the markdown format whether they appear in code, in a markdown file, etc ...

## Running the Sample

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window

# Adding a New Keyboard Shortcut
1. Register the command in extensions.ts
2. Update package.json with the binding ...
	- https://code.visualstudio.com/api/references/vscode-api#TextEditor

