# GH-pages-deploy

# *** DO NOT USE STILL NEEDS FURTHER TESTING ***
<!-- [![NPM](https://nodei.co/npm/gh-pages-deploy.png?downloads=true)](https://npmjs.org/package/gh-pages-deploy) -->

Deploy straight to [github pages]() with one simple command.

All you need to do is specify a couple of things in your package.json(all of which are optional)

``` JSON
  "gh-pages-deploy": {
    "staticpath": "dist/",
    "cname": "nope.org",
    "prep": [
      "build-sass",
      "optimize-img"
    ],
    "confirm" true
  },

```

* "staticpath" path to your files to be copied over to the root directory
* "cname" content for CNAME file
* "prep" an array of script names to run before pushing to github, this can be
any script that you have declared in your "scripts" object in your `package.json`.
* "confirm" if this is set to true, the prep scripts will be printed into you
console for your review and confirmation before executing.

## About

This was inspired after a conversation with [max ogden]() regarding the setup of
the [Code For Portland]() Jekyll Pages. Inspired by the [
leveldb.org repository](https://github.com/Level/leveldb.org/blob/master/package.json#L13), I
wanted an easier way for people to generate static pages and deploy to github without
being tied to just jekyll.

## LICENSE

MIT


