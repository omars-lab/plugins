SHELL := /bin/bash
MAKEFILE_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
AZURE_TOKEN := $(shell lpass show -j --id 8644053853501480489 | jq -r '.[0].note')

setup: 
	test -d ${MAKEFILE_DIR}/node_modules || ( cd ${MAKEFILE_DIR} && npm install ) 

test:
	find tst/ -name '*.ts' | xargs tsc
	find tst/ -name '*.js' | xargs node
	
compile: setup
	cd ${MAKEFILE_DIR} && vsce package

install: compile
	find ${MAKEFILE_DIR} -name '*.vsix' | xargs -n 1 code --install-extension

publish: compile install
	@vsce publish -p "${AZURE_TOKEN}"
