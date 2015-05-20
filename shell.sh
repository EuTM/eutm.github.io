#!/bin/sh

rm -rf dist/
g rm --cached -r dist && g c -m "remove dist" 
BROCCOLI_TACO_ENV=production broccoli-taco build dist
g a dist && g c -m "add dist again"
g subtree push --prefix dist origin master-tmp
g checkout master && g rebase master origin/master-tmp
