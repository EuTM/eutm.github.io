#!/bin/sh
g co dev
rm -rf dist/ && BROCCOLI_TACO_ENV=production broccoli-taco build dist
g co master
ls | egrep -v "dist|bower_components|node_modules|CNAME" | xargs rm -rf
mv dist/* .
g a -A
g c -m "update eutm site"
g p origin master:master
g co - 
