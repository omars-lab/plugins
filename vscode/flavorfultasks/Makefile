SHELL := /bin/bash
MAKEFILE_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
CODE_PATH:=/Applications/Visual\ Studio\ Code.app/Contents
BREW_PREFIX:=${MAKEFILE_DIR}
USER:=$(shell ls -1 /Users/ | grep -v Shared | grep -v admin | head -n 1)

.PHONY : clean setup test compile brew-install install

clean:
	rm -rf "${MAKEFILE_DIR}/node_modules"

setup: 
	(npm list -g --depth=0 | sed -E 's/(├|└)── //g' | grep -q vsce) || npm install -g vsce
	test -d ${MAKEFILE_DIR}/node_modules || ( cd ${MAKEFILE_DIR} && npm install ) 

test:
	find tst/ -name '*.ts' | xargs tsc
	find tst/ -name '*.js' | xargs node
	
compile: setup
	cd ${MAKEFILE_DIR} && vsce package
	mv ${MAKEFILE_DIR}/*.vsix ${MAKEFILE_DIR}/releases/

brew-install:
	# ls -la ${MAKEFILE_DIR}
	# echo "${PATH}"
	# find ${MAKEFILE_DIR} -name '*.vsix' | PATH="${CODE_PATH}:${PATH}" xargs -n 1 code --install-extension
	# cd ${CODE_PATH} && \
	# 	find ${MAKEFILE_DIR} -name '*.vsix' \
	# 	| ( \
	# 		xargs -n 1 ${CODE_PATH}/Resources/app/bin/code --verbose --install-extension \
	# 	) > "${BREW_PREFIX}/vsix-install.out.log" 2>"${BREW_PREFIX}/vsix-install.err.log"
	# Brew runs as a different user / has a different home dir ... ?
	# Also ... if commands in brew try to rm files ... brew kills them ?
	# Instead of installing ... I will refresh a vscode-plugin-reinstall script ... to run after execution!
	# ( \
	# 	whoami ; \
	# 	ls ${BREW_PREFIX} ; \
	# 	cd ${CODE_PATH} && \
	# 	${CODE_PATH}/Resources/app/bin/code --log off --user-data-dir /Users/${USER}/Library/Application\ Support/Code/User --extensions-dir /Users/${USER}/.vscode/extensions --install-extension ${BREW_PREFIX}/releases/flavorfultasks-0.0.1.vsix ; \
	# 	${CODE_PATH}/Resources/app/bin/code --log off --user-data-dir /Users/${USER}/Library/Application\ Support/Code/User --extensions-dir /Users/${USER}/.vscode/extensions --list-extensions \
	# ) > "${BREW_PREFIX}/vsix-install.out.log" 2>"${BREW_PREFIX}/vsix-install.err.log"
	echo start > "${BREW_PREFIX}/vsix-install.out.log"
	env >> "${BREW_PREFIX}/vsix-install.out.log"
	whoami >> "${BREW_PREFIX}/vsix-install.out.log"
	echo "#!/bin/bash" > ${BREW_PREFIX}/vscode-reinstall-plugins
	# --user-data-dir /Users/${USER}/Library/Application\ Support/Code/User
	echo "${CODE_PATH}/Resources/app/bin/code \
		--verbose \
		--extensions-dir /Users/${USER}/.vscode/extensions \
		--install-extension ${BREW_PREFIX}/releases/flavorfultasks-0.0.1.vsix" >> ${BREW_PREFIX}/vscode-reinstall-plugins
	chmod +x ${BREW_PREFIX}/vscode-reinstall-plugins
	echo end >> "${BREW_PREFIX}/vsix-install.out.log"

install: compile brew-install