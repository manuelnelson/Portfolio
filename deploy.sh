#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:manuelnelson/Portfolio.git main

