var exec = require('child_process').exec;
var format = require('util').format;
var chalk = require('chalk');

var gitbranch = "git branch -f gh-pages && ";
var gitcheckout = "git checkout gh-pages && ";
var gitcommit = "git add -A . && git commit -a -m 'gh-pages update' && ";

function getResetCMD(defaultBranch) {
  return format("git reset --hard %s && ", defaultBranch);
}

function getPushCMD(defaultBranch) {
  return format("git push origin gh-pages --force && git checkout %s", defaultBranch);
}

module.exports = {
  getBuildCMD: function(prepCMD, defaultBranch) {
    var gitreset = getResetCMD(defaultBranch);
    var gitpush = getPushCMD(defaultBranch);

    return gitbranch + gitcheckout + gitreset + prepCMD + gitcommit + gitpush;
  },

  buildPrep: function(cfg) {
    var cmd = '';
    var prefix = 'npm run ';
    if (cfg.prep) {
      cfg.prep.forEach(function(script, idx) {
        cmd += prefix + script + ' && ';
      });
    }

    if (cfg.staticpath) cmd += "cp -r " + cfg.staticpath + "/* . && ";
    if (cfg.cname) cmd += "echo '" + cfg.cname + "' > CNAME && ";

    return cmd;
  },

  displayCMD: function(buildCMD) {
    var display = buildCMD.split('&&');
    console.log(chalk.gray('Preparing to deploy to gh-pages with these commands: \n'));
    display.forEach(function(script, idx) {
      if (idx === 0) {
        console.log(chalk.blue(' '+ script + '\n'));
      } else {
        console.log(chalk.blue(script + '\n'));
      }
    });
  },

  execBuild: function(cmd) {
    exec(cmd, function (error, stdout, stderr) {
      console.log(chalk.yellow('gh-pages-deploy:stdout: ') + chalk.green(stdout));
      console.log(chalk.red('gh-pages-deploy:stderr: ') + stderr);
      if (error !== null) {
        console.log(chalk.red('gh-pages-deploy:error: ') + error);
      }
    });
  }
}