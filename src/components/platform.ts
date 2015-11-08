/// <reference path="../typings/_custom.d.ts" />

var client = process.platform;
var arch = process.arch === 'ia32' ? '32' : '64';
client = client.indexOf('win') === 0 ? 'win' : client.indexOf('darwin') === 0 ? 'osx' : 'linux';

export class platform {
  public isOsx: boolean;
  public isWindows: boolean;
  public isLinux: boolean;
  public name: string;
  public type: string;
  public arch: string;

  constructor() {
    if (client === 'osx') {
      this.isOsx = true;
    } else {
      this.isOsx = false;
    }

    if (client === 'win') {
      this.isWindows = true;
    } else {
      this.isWindows = false;
    }

    if (client === 'linux') {
      this.isLinux = true;
    } else {
      this.isLinux = false;
    }

    this.name = client + arch;
    this.type = client;
    this.arch = arch;
  }
}
