#!/bin/bash

git branch -D gh-pages

cp -R dist _publish/ && 
git checkout --orphan gh-pages &&
cd _publish && git add --all &&
git commit -m "deploy `date`" &&
git push -f origin gh-pages &&
rm -rf _publish &&
git checkout master && 
echo 'published!'
