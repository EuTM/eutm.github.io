var broccoliCMS = require('broccoli-taco'), 
    filterLess = require('broccoli-less-single'),
    mergeTrees = require('broccoli-merge-trees'),
    pickFiles = require('broccoli-static-compiler'),
    removeDir = require('broccoli-file-remover'),
    autoprefixCSS = require('broccoli-autoprefixer'),
    liveReload = require('broccoli-inject-livereload'),
    uglifyJS = require('broccoli-uglify-js'),
    assetRev = require('broccoli-asset-rev'),
    imageMin = require('broccoli-imagemin'),
    htmlMin = require('broccoli-htmlmin');


var environment = process.env['BROCCOLI_TACO_ENV'] || 'development';
var site = new broccoliCMS();
var tree = site.toTree();

var vendorFiles = pickFiles('bower_components', {
    srcDir: '/',
    destDir: 'vendor'
});

var less = pickFiles('site/less', {srcDir: '/', destDir: '.'});
less = mergeTrees([less, vendorFiles]);
less = filterLess(less, 'app.less', '/static/css/app.css');
less = removeDir(less, {path: './vendor'});

tree = mergeTrees([less, tree], {overwrite: true});
tree = autoprefixCSS(tree, {});

if(environment === 'development'){
    tree = liveReload(tree);
}

if(environment === 'production'){
    cnameTree = pickFiles('site', {srcDir: '/', files: ['CNAME'], destDir: '.'});
    tree = mergeTrees([cnameTree, tree]);
    tree = uglifyJS(tree, {compress: true});
    tree = imageMin(tree, {
        interlaced: true, optimizationLevel: 3, progressive: true, lossyPNG: false
    });
    tree = htmlMin(tree, {comments: true});
    tree = assetRev(tree, {
        extensions: ['js', 'css', 'png', 'jpg', 'gif', 'svg'],
        exclude: ['static/fonts'],
        replaceExtensions: ['html', 'js', 'css'],
    });
}

module.exports = tree;

