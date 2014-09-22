# GH-pages-deploy

[![NPM](https://nodei.co/npm/gh-pages-deploy.png?downloads=true)](https://npmjs.org/package/gh-pages-deploy)

Deploy straight to [github pages](https://pages.github.com/) with one simple command.

All you need to do is specify a couple of things in your package.json(all of which are optional)

``` JSON
  "gh-pages-deploy": {
    "staticpath": "dist",
    "cname": "nope.org",
    "prep": [
      "build-sass",
      "optimize-img"
    ],
    "noprompt" false
  },

```

* "staticpath" path to your files to be copied over to the root directory
* "cname" content for CNAME file
* "prep" an array of script names to run before pushing to github, this can be
any script that you have declared in your "scripts" object in your `package.json`.
* "noprompt" if this is set to true, the prompt will be bypassed and you will never
need to confirm the commands before deploying.

## About
This repo uses `gh-pages-deploy`. Checkout the [gh-pages](https://github.com/meandavejustice/gh-pages-deploy/tree/gh-pages)
branch and the result at [http://davejustice.com/gh-pages-deploy/](http://davejustice.com/gh-pages-deploy/).


This was inspired after a conversation with [max ogden](https://github.com/maxogden) regarding the setup of
the [Code For Portland](http://www.codeforportland.org/) Jekyll Pages. Inspired by the [
leveldb.org repository](https://github.com/Level/leveldb.org/blob/master/package.json#L13), I
wanted an easier way for people to generate static pages and deploy to github without
being tied to just jekyll.

## LICENSE

MIT


