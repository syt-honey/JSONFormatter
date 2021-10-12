# deploy.sh
# stop operation when an error occurs
set -e

# build
yarn build

# go to the target folder
cd dist

# commit to repo
git init
git add -A
git commit -m 'deploy'

# push to the target branch
git push -f git@github.com:syt-honey/JSONFormatter.git master:main

cd -
