const childProcess = require('child_process');
const os = require('os');

class Instance {
  constructor(customPaths) {
    this._binPath = undefined;

    let options = [];
    let platform = os.platform();
    if (platform === 'darwin') {
      options.push(`/Applications/Aseprite.app/Contents/MacOS/aseprite`);
      options.push(`${process.env.HOME}/Applications/Aseprite.app/Contents/MacOS/aseprite`);
      options.push(`aseprite`);
    } else if (platform === 'win32') {
      options.push(`C:\\Program Files (x86)\\Aseprite\\Aseprite.exe`);
      options.push(`C:\\Program Files\\Aseprite\\Aseprite.exe`);
      options.push(`Aseprite`);
    }
    if (customPaths) {
      options = options.concat(customPaths);
    }

    this._searchPaths = options;
  }

  async exec(args) {
    const path = await this.binPath();
    return this.raw(path, this.flattenArgs(args));
  }

  async binPath() {
    if (this._binPath) return this._binPath;

    for (let path of this._searchPaths) {
      try {
        this._raw(path, '--version');
        this._binPath = path;
        return path;
      } catch (e) { }
    }

    throw new Error('Unable to find Aseprite binary. Searched in: ' + JSON.stringify(this._searchPaths, undefined, 2));
  }

  /*async raw(path, args) {
    const child = (typeof args === 'string') ?
      childProcess.spawn(`${path} ${args}`, [], { shell: true }) :
      childProcess.spawn(path, args);
    let stdout = '', stderr = '';

    child.stdout.on('data', data => { stdout += data; });
    child.stderr.on('data', data => { stderr += data; });

    return new Promise((resolve, reject) => {
      child.addListener('error', (code, signal) => {
      });
      child.addListener('exit', (code, signal) => {
        if (code === 0) {
          resolve({
          });
      });
    });

  return new Promise((resolve, reject) => {
    child.addListener('error', (code, signal) => {
      console.log('ChildProcess error', code, signal);
      reject();
    });
    child.addListener('exit', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}


      windowsHide <boolean> Hide the subprocess console window that would normally be created on Windows systems. Default: false.
      Returns: <Object>
      pid <number> Pid of the child process.
      output <Array> Array of results from stdio output.
      stdout <Buffer> | <string> The contents of output[1].
      stderr <Buffer> | <string> The contents of output[2].
      status <number> | <null> The exit code of the subprocess, or null if the subprocess terminated due to a signal.
      signal <string> | <null> The signal used to kill the subprocess, or null if the subprocess did not terminate due to a signal.
      error <Error> The error object if the child process failed or timed out.

    if (result.stdout) result.stdout = result.stdout.toString();
    if (result.stderr) result.stderr = result.stderr.toString();
    return result;
  }
*/
  execSync(args) {
    const path = this.binPathSync();
    return this.rawSync(path, this.flattenArgs(args));
  }

  binPathSync() {
    if (this._binPath) return this._binPath;

    for (let path of this._searchPaths) {
      try {
        this.rawSync(path, '--version');
        this._binPath = path;
        return path;
      } catch (e) { }
    }

    throw new Error('Unable to find Aseprite binary. Searched in: ' + JSON.stringify(this._searchPaths, undefined, 2));
  }

  rawSync(path, args) {
    const result = (typeof args === 'string') ?
      childProcess.spawnSync(`${path} ${args}`, [], { shell: true }) :
      childProcess.spawnSync(path, args);

    if (result.stdout) result.stdout = result.stdout.toString();
    if (result.stderr) result.stderr = result.stderr.toString();
    return result;
  }

  flattenArgs(args) {
    if (Array.isArray(args)) {
      return args;
    } else if (typeof args === 'object') {
      args = Object.entries(args).reduce((out, [key, value]) => {
        if (!key.startsWith('--')) {
          key = '--' + key.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
          out.push(`${key}="${value}"`);
        }
        return out;
      }, []);
    } else {
      args = String(args);
    }
    return args;
  }
}

module.exports = Instance;
