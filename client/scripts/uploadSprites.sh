#!/bin/bash
set -e;

bucketSpritesDir=s3://pokemon-showdown-random-battle-helper/sprites;

for spritedir in `ls sprites`
do
    aws2 s3 sync "./sprites/$spritedir" "$bucketSpritesDir/$spritedir" --cache-control "public, max-age=15552000";
done

