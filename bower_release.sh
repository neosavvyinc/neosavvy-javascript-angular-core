#!/bin/sh
TAG="$1"

if [ $# -ne 1 ]
then
  echo "Usage: $0 {Tag-Name}"
  echo "Cuts a bower release for the tag specified"
  exit 1
fi

grunt

#Tag the development repo
git tag $TAG
git push --tags

cp target/*.js ../bower-neosavvy-javascript-core
cp bower.json ../bower-neosavvy-javascript-core
sed -i.bak "s/neosavvy-javascript-core-development/neosavvy-javascript-core/g" ../bower-neosavvy-javascript-core/bower.json
rm ../bower-neosavvy-javascript-core/bower.json.bak
cd ../bower-neosavvy-javascript-core
git add .
git commit -am "Version $TAG"
git push

#Tag the bower repo
git tag $TAG
git push --tags
