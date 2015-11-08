/// <reference path="../typings/_custom.d.ts" />

//TODO: request and semver need def typings.

import platform = require('./platform');
import dispatcher = require('./dispatcher');
import request = require('request');
import semver = require('semver');
var gui = require('nw.gui');

export class updater {

	private dispatcher;
	private platform;

	constructor() {
		this.dispatcher = new dispatcher.dispatcher();
		this.platform = new platform.platform();
	}

	/**
	* Check if there's a new version available.
 	*/
  public check(manifest, callback) {
    request(manifest.manifestUrl, function(error, response, body) {
      if (error) {
        return callback(error);
      }

      var newManifest = JSON.parse(body);
      var newVersionExists = semver.gt(newManifest.version, manifest.version);

      callback(null, newVersionExists, newManifest);
    });
  }

  /**
   * Show a dialog to ask the user to update.
   */
  public prompt(win, ignoreError, error, newVersionExists, newManifest) {
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
      var updateMessage = 'There’s a new version available (' + newManifest.version + '). Would you like to download the update now?';

      this.dispatcher.trigger('win.confirm', {
        win: win,
        message: updateMessage,
        callback: function(result) {
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
  public checkAndPrompt(manifest, win) {
    this.check(manifest, this.prompt.bind(this, win, true));
  }

}