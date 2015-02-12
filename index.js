var exec = require('child_process').exec;
var gasket = require('gasket');
var chalk = require('chalk');
var prompt = require('prompt');
prompt.message = "gh-pages-deploy".grey;
prompt.delimiter = "=>".grey;

var gitbranch = "git branch -f gh-pages";
var gitcheckout = "git checkout gh-pages";
var gitreset = "git reset --hard origin/master";
var gitadd = "git add -A .";
var gitcommit = "git commit -a -m 'gh-pages update'";
var gitpush = "git push origin gh-pages --force";
var gitcheckmaster = "git checkout master";
var getcurrentbranch = "git rev-parse --abbrev-ref HEAD";

var question = {
  properties: {
    recover: {
      description: 'There was an error. Would you like to try and recover your original state? (Y/N)'.magenta
    }
  }
};

function getBuildCmd(prepCmds) {
  return insert(prepCmds, [gitbranch,
                           gitcheckout,
                           gitreset,
                           gitadd,
                           gitcommit,
                           gitpush,
                           gitcheckmaster], 3);
}

function getPrepCmd(cfg) {
  var prefix = 'npm run ';
  var userCmds = [];
  if (cfg.prep) {
    userCmds = cfg.prep.map(function(script) {
      return prefix + script;
    });
  }

  if (cfg.staticpath) userCmds.push("cp -r " + cfg.staticpath + "/* .");
  if (cfg.cname) userCmds.push("echo '" + cfg.cname + "' > CNAME");

  return userCmds;
}

function displayCmds(cmd) {
  console.log(chalk.gray('Preparing to deploy to gh-pages with these commands: \n'));
  cmd.forEach(function(script, idx) {
    if (script !== null) {
      if (idx === 0) {
        console.log(chalk.blue(' '+ script + '\n'));
      } else {
        console.log(chalk.blue(script + '\n'));
      }
    }
  });
}

function getRecoverCmd(currentBranch) {
  return ["echo recovering your original state",
          "echo checking out "+currentBranch,
          "git checkout "+currentBranch];
}

function execBuild(buildCmd, cfg) {
  exec(getcurrentbranch, function (error, stdout, stderr) {
    var currentBranch = stdout;

    var pipelines = gasket({
      build: buildCmd,
      recover: prepBuild(getRecoverCmd(currentBranch))
    });
    pipelines.run('build').on('error', function(err) {
      if (!cfg.noprompt) {
        prompt.start();
        prompt.get(question, function(err,result) {
          if (result.recover.toLowerCase() === 'n') process.exit(0);
          pipelines.run('recover').pipe(process.stdout);
        });
      } else {
        pipelines.run('recover').pipe(process.stdout);
      }

    }).pipe(process.stdout)
  });
}

function insert(toInsert, dest, index) {
  for (var i=0; i<toInsert.length;i++) {
    dest.splice(i+index, 0, toInsert[i]);
  }

  return dest;
}

function prepBuild (cmds) {
  var freshArr = [];
  cmds.forEach(function(cmd) {
    freshArr.push(cmd);
    freshArr.push(null);
  });
  return freshArr;
}

function getFullCmd(cfg) {
  return prepBuild(getBuildCmd(getPrepCmd(cfg)));
}

module.exports = {
  getFullCmd: getFullCmd,
  displayCmds: displayCmds,
  execBuild: execBuild
}