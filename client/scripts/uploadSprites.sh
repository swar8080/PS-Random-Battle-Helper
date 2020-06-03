#!/bin/bash
set -e;

if [[ "stage" = $1 || "prod" = "$1" ]]; then
    bucketSpritesDir=s3://pokemon-showdown-random-battle-helper-$1/sprites;

    for spritedir in `ls sprites`
    do
        aws2 s3 sync "./sprites/$spritedir" "$bucketSpritesDir/$spritedir" --cache-control "public, max-age=15552000";
    done
else
    echo "Error: stage or prod must be selected";
    exit 1;
fi;