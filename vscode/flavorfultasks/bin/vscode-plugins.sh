
# https://builderhub.corp.amazon.com/docs/native-aws/developer-guide/getting-started-migrating.html
# https://builderhub.corp.amazon.com/docs/native-aws/developer-guide/tutorials.html#cdk-applications
# https://code.visualstudio.com/api/working-with-extensions/publishing-extension
# https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix

function vscode-reinstall-local-plugin() {
	test package.json || ( echo "need to be in a vscode plugin dir with package.json" && exit 1 )
	vsce package
	find . -name '*.vsix' | xargs -n 1 code --install-extension 
}

function vscode-install-personal-plugin() {
	FILE=$(mktemp -d)
	PLUGIN="${1}"
	VERSION="${2}"
	github_curl -o "${FILE}/${PLUGIN}-${VERSION}.vsix" https://github.com/omars-lab/plugins/blob/master/vscode/${PLUGIN}/releases/${PLUGIN}-${VERSION}.vsix?raw=true
	code --install-extension "${FILE}/${PLUGIN}-${VERSION}.vsix"
	rm -rf "${FILE}"
}

function vscode-reinstall-plugins() {
	vscode-install-personal-plugin "flavorfultasks" "0.0.1"
}
