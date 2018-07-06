var exec = require('child_process').exec;
var gasket = require('gasket');
var chalk = require('chalk');
var prompt = require('prompt');
require('string-format').extend(String.prototype, {})

prompt.message = "gh-pages-deploy".grey;
prompt.delimiter = "=>".grey;

var defaultmessage = "gh-pages update";

var gitbranch = "git branch -f '{gh-pages}'";
var gitcheckout = "git checkout '{gh-pages}'";
var gitreset = "git reset --hard '{remote}/{branch}'";
var gitadd = "git add -A .";
var gitcommit = "git commit -a -m '{commit}'";
var gitpush = "git push {remote} '{gh-pages}' --force";
var gitcheckoutbranch = "git checkout '{branch}'";
var gitcurrentbranch = "git rev-parse --abbrev-ref HEAD";

var question = {
  properties: {
    recover: {
      description: chalk.magenta('There was an error. Would you like to try and recover your original state? (Y/N)')
    }
  }
};

function getBuildCmds(cfg) {
  cfg.commit = process.argv[3] || cfg.commit || defaultmessage;
  cfg.branch = process.argv[4] || cfg.branch || 'master';
  cfg.remote = process.argv[5] || cfg.remote || 'origin';
  cfg['gh-pages'] = process.argv[6] || cfg['gh-pages'] || 'gh-pages';
  return prepBuild([].concat(
    getGitPrepCmds(cfg),
    getNpmRunCmds(cfg.prep),
    getStaticPathCmds(cfg.staticpath),
    getCnameCmds(cfg.cname),
    getNpmRunCmds(cfg.post),
    getGitPostCmds(cfg)
  ));
}

function getGitPrepCmds(cfg) {
  return [
    gitbranch.format(cfg),
    gitcheckout.format(cfg),
    gitreset.format(cfg)
  ];
}

function getGitPostCmds(cfg) {
  return [
    gitadd,
    gitcommit.format(cfg),
    gitpush.format(cfg),
    gitcheckoutbranch.format(cfg)
  ];
}

function getStaticPathCmds(staticpath) {
  return staticpath ? ["cp -rT " + staticpath + "/ ."] : [];
}

function getCnameCmds(cname) {
  return cname ? ["echo '" + cname + "' > CNAME"] : [];
}

function getNpmRunCmds(cmds) {
  cmds = cmds || [];
  var prefix = 'npm run ';
  return cmds.map(function(script) { return prefix + script; });
}

function displayCmds(cmd) {
  console.log(chalk.gray('Preparing to deploy to gh-pages with these commands: \n'));
  cmd.forEach(function(script) {
    if (script !== null) {
      console.log(chalk.blue(script + '\n'));
    }
  });
}

function getRecoverCmds(branch) {
  return prepBuild([
    "echo recovering your original state",
    "echo checking out " + branch,
    gitcheckoutbranch.format({ branch })
  ]);
}

function execBuild(buildCmds, cfg) {
  exec(gitcurrentbranch, function (error, stdout, stderr) {
    var currentBranch = stdout;

    var pipelines = gasket({
      build: buildCmds,
      recover: getRecoverCmds(currentBranch)
    });
    pipelines.run('build').on('error', function(err) {
      if (!cfg.noprompt) {
        prompt.start();
        prompt.get(question, function(err, result) {
          if (result.recover.toLowerCase() === 'n') process.exit(0);
          pipelines.run('recover').pipe(process.stdout);
        });
      } else {
        pipelines.run('recover').pipe(process.stdout);
      }

    }).pipe(process.stdout)
  });
}

function prepBuild (cmds) {
  var freshArr = [];
  cmds.forEach(function(cmd) {
    freshArr.push(cmd);
    freshArr.push(null);
  });
  return freshArr;
}

module.exports = {
  getBuildCmds: getBuildCmds,
  displayCmds: displayCmds,
  execBuild: execBuild
}
