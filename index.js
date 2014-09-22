var requireModule = require('require-module');
var packageJSON = requireModule('./package.json');
var config = packageJSON['gh-pages-deploy'];

var gitcheckout = "git checkout gh-pages && git reset --hard origin/master && ";
var gitcommit = "git add -A . && git commit -a -m 'gh-pages update' && ";
var gitpush = "git push origin gh-pages --force && git checkout master";

var prepScripts = config.prep;
var cname = config.cname;
var exec = require('child_process').exec,
    buildProcess;

var prepCMD = buildPrep(config.staticpath, config.prep, config.cname);
var buildCMD = gitcheckout + prepCMD + gitcommit + gitpush;

displayCMD();
function displayCMD() {
  var display = buildCMD.split('&&');
  console.log('Preparing to deploy to gh-pages with these commands: \n');
  display.forEach(function(script, idx) {
    if (idx === 0) {
      console.log(' '+ script + '\n');
    } else {
      console.log(script + '\n');
    }
  });
}

function buildPrep(staticDIR, prepScripts, cname) {
  var cmd = '';
  var prefix = 'npm run ';
  prepScripts.forEach(function(script, idx) {
    cmd += prefix + script + ' && ';
  });

  if (staticDIR) cmd += "cp -r " + staticDIR + "/* && ";
  if (cname) cmd += "echo '" + cname + "' > CNAME && ";

  return cmd;
}

function execBuild(cmd) {
  exec(cmd, function (error, stdout, stderr) {
    console.log('gh-pages-deploy:stdout: ' + stdout);
    console.log('gh-pages-deploy:stderr: ' + stderr);
    if (error !== null) {
      console.log('gh-pages-deploy:error: ' + error);
    });
}