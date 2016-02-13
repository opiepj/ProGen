/// <reference path="../typings/_custom.d.ts" />

import platform = require('./platform');
import dispatcher = require('./dispatcher');
import request = require('request');
import semver = require('semver');
var gui: any = require('nw.gui');

export class updater {

  private dispatcher: any;
  private platform: any;

  constructor() {
    this.dispatcher = new dispatcher.dispatcher();
    this.platform = new platform.platform();
  }

  /**
   * Check if there's a new version available.
   */
  public check(manifest: any, callback: Function) {
    request(manifest.manifestUrl, function (error: Error, response: any, body: any) {
      if (error) {
        return callback(error);
      }

      var newManifest: any = JSON.parse(body);
      var newVersionExists: any = semver.gt(newManifest.version, manifest.version);

      callback(null, newVersionExists, newManifest);
    });
  }

  /**
   * Show a dialog to ask the user to update.
   */
  public prompt(win: any, ignoreError: boolean, error: Error, newVersionExists: boolean, newManifest: any) {
    if (error) {
      if (!ignoreError) {
        this.dispatcher.trigger('win.alert', {
          win: win,
          message: 'Error while trying to update: ' + error
        });
      }

      return;
    }

    if (newVersionExists) {
      var updateMessage: string = 'There’s a new version available (' + newManifest.version + '). Would you like to download the update now?';

      this.dispatcher.trigger('win.confirm', {
        win: win,
        message: updateMessage,
        callback: function (result: any) {
          if (result) {
            gui.Shell.openExternal(newManifest.packages[this.platform.name]);
            gui.App.quit();
          }
        }
      });
    }
  }

  /**
   * Check for update and ask the user to update.
   */
  public checkAndPrompt(manifest: any, win: any) {
    this.check(manifest, this.prompt.bind(this, win, true));
  }

}
