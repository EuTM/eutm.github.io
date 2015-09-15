EUTM Website
------------

to checkout and add content, do the following:
- npm install -g broccoli-taco
- npm install && bower install
- git checkout dev


to build the static site, do the following:

- BROCCOLI_TACO_ENV={production|development} broccoli-taco build {target-dir}

to run development server:

- BROCCOLI_TACO_ENV={production|development} broccoli-taco serve


The master branch is used for publishing purposes.
