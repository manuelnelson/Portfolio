#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'www.emmanuelnelson.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f https://github.com/manuelnelson/manuelnelson.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
#git push -f https://github.com/manuelnelson/VueJs-Portfolio.git master:gh-pages

cd -
