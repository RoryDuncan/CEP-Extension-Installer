var platform = require("os").platform;
var install_process = require("child_process");
var path = require('path');

function targetPath() {

  switch (platform()) {
    case "darwin":
      return "bin/OSX/Contents/MacOS/ExManCmd";
      break;
    case "win32":
      return "bin/WINDOWS/ExManCmd.exe";
    case "win64":
      return "bin/WINDOWS/ExManCmd.exe";
  }
  return null;
}


var errors = (new global.Messages()).errors

class Installer {

  constructor(zxpPath) {
    
    this.zxpPath = zxpPath;

    var prefix = (platform() == "darwin") ? "--" : "/"
    this.installCommand = `${prefix}install`;
    this.uninstallCommand = `${prefix}uninstall`;
    this.target = targetPath();

  }

  install() {
    return new Promise(function (resolve, reject) {

      var spawn = install_process.spawn(path.join(__dirname, target_path()), [this.installCommand, this.zxpPath]);

      spawn.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
        var logbits = /-(\d+)/.exec(data.toString());
        var code = logbits && logbits[1] ? parseInt(logbits[1]) : null;

        if (code === null) {
          return;
        }

        reject(errors.get(code) || 'Error: ' + data.toString());
      });

      spawn.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
        var logbits = /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) : ([A-Z]+)\s+(.*)/.exec(data.toString());
        var date = logbits[1];
        var time = logbits[2];
        var level = logbits[3];
        var message = logbits[4];
        if (level === 'ERROR') { reject(message); }
      });

      // code 0 => success
      spawn.on('exit', function (code) {
        if (code == 0) { resolve() }
      });

    });
  }

  uninstall() {
    throw new Error("Not Implemented");
  }

}