#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[1]}" )" >/dev/null 2>&1 && pwd )"

OMNI_HOME="${HOME}/Library/Containers/com.omnigroup.OmniGraffle7"
OMNI_STENCILS="${OMNI_HOME}/Data/Library/Application Support/The Omni Group/OmniGraffle/Stencils"

# Stencils need to live in the omnigraffle dir to be seen in side panel, thus they need to be backed up.
cp -f "${OMNI_STENCILS}"/Processes/* ${DIR}/omnigraffle/
