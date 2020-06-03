#!/bin/bash
set -e;

if [[ "stage" = $1 || "prod" = "$1" ]]; then
    if [[ "stage" = $1 ]]; then
        npm run build:stage;
    else
        npm run build:prod;
    fi

    bucket=s3://pokemon-showdown-random-battle-helper-$1;
    aws2 s3 rm $bucket --recursive --exclude "sprites/*";
    aws2 s3 cp "./build/index.html" $bucket --cache-control "no-store";
    aws2 s3 sync ./build $bucket --exclude "./build/index.html" --cache-control "public, max-age=2592000";
else
    echo "Error: stage or prod must be selected";
    exit 1;
fi;