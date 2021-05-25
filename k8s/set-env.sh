#!/bin/bash

if [ "$CI_COMMIT_REF_NAME" == "master" ];
then    
    sed -i 's/dev/prod/g' src/utils/request.js
    echo "env is prod"
else
    sed -i 's/prod/dev/g' src/utils/request.js
    echo "env is dev"
fi