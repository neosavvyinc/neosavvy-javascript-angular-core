#!/bin/bash
cp target/*.js ../bower-neosavvy-javascript-angular-core
cp bower.json ../bower-neosavvy-javascript-angular-core
sed -i.bak "s/neosavvy-javascript-angular-core-development/neosavvy-javascript-angular-core/g" ../bower-neosavvy-javascript-angular-core/bower.json
rm ../bower-neosavvy-javascript-angular-core/bower.json.bak
