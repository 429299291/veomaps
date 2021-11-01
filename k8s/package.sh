#!/bin/bash

# npm install
npm install npm@6.14.12
if [ "$CI_COMMIT_REF_NAME" == "master" ];
then
    sed -i 's/dev/prod/g' src/utils/request.js
    echo "env is prod"
else
    sed -i 's/prod/dev/g' src/utils/request.js
    echo "env is dev"
fi


npm run build
ls dist
sed -i 's/1890ff/51B5AA/g' dist/color.less