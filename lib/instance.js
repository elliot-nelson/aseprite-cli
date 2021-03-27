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

  async binPath() {
    if (this._binPath) return this._binPath;

    for (let path of this._searchPaths) {
      try {
        this._raw(path, '--version');
        this.binPath = path;
        return path;
      } catch (e) { }
    }

    throw new Error('Unable to find Aseprite binary. Searched in: ' + JSON.stringify(this._searchPaths, undefined, 2));
  }

  async _raw(path, argString) {
    const command = `${path} ${argString}`;
    const result = childProcess.execSync(command);
    return result.toString('utf8');
  }

  execSync(args) {
    const path = this.binPathSync();

    if (Array.isArray(args)) {
      args = args.join(' ');
    } else if (typeof args === 'object') {
      args = Object.entries(args).reduce((out, [key, value]) => {
        if (!key.startsWith('--')) {
          key = '--' + key.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
          out.push(`${key}="${value}"`);
        }
        return out;
      }, []).join(' ');
    }

    return this.rawSync(path, args);
  }

  binPathSync() {
    if (this._binPath) return this._binPath;

    for (let path of this._searchPaths) {
      try {
        this.rawSync(path, '--version');
        this.binPath = path;
        return path;
      } catch (e) { }
    }

    throw new Error('Unable to find Aseprite binary. Searched in: ' + JSON.stringify(this._searchPaths, undefined, 2));
  }

  rawSync(path, argString) {
    console.log(path, argString);
    const command = `${path} ${argString}`;
    const result = childProcess.execSync(command);
    return result.toString('utf8');
  }
}

module.exports = Instance;
