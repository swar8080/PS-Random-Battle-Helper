#!/bin/bash
set -e;

bucket=s3://pokemon-showdown-random-battle-helper

npm run build;

aws2 s3 rm $bucket --recursive --exclude "sprites/*";
aws2 s3 cp "./build/index.html" $bucket --cache-control "no-store";
aws2 s3 sync ./build $bucket --exclude "./build/index.html" --cache-control "public, max-age=2592000";