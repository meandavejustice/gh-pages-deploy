var exec = require('child_process').exec;
var chalk = require('chalk');

var gitbranch = "git branch -f gh-pages && ";
var gitcheckout = "git checkout gh-pages && ";
var gitreset = "git reset --hard origin/master && ";
var gitcommit = "git add -A . && git commit -a -m 'gh-pages update' && ";
var gitpush = "git push origin gh-pages --force && git checkout master";

module.exports = {
  getBuildCMD: function(prepCMD) {
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