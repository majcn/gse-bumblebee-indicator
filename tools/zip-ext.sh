#!/bin/sh

EXT_PATH='../bumblebee-indicator@gnome-shell-extensions.majcn.github.com'
ZIP_FILE='bumblebee-indicator@gnome-shell-extensions.majcn.github.com.zip'
TOOLS_PATH='../tools'

rm -f ${ZIP_FILE}
cd ${EXT_PATH}
zip -r ${TOOLS_PATH}/${ZIP_FILE} . -x \*~
cd ${TOOLS_PATH}
