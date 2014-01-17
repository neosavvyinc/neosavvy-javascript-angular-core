#!/bin/sh
TAG="$1"

if [ $# -ne 1 ]
then
  echo "Usage: $0 {Tag-Name}"
  echo "Cuts a bower release for the tag specified"
  exit 1
fi

grunt
cp target/*.js ../bower-neosavvy-javascript-angular-core
cp bower.json ../bower-neosavvy-javascript-angular-core
cp README.md ../bower-neosavvy-javascript-angular-core
sed -i.bak "s/neosavvy-javascript-angular-core-development/neosavvy-javascript-angular-core/g" ../bower-neosavvy-javascript-angular-core/bower.json
rm ../bower-neosavvy-javascript-angular-core/bower.json.bak
cd ../bower-neosavvy-javascript-angular-core
git add .
git commit -am "Version $TAG"
git push
git tag $TAG
git push --tags
