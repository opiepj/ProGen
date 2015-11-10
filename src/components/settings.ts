/// <reference path="../typings/_custom.d.ts" />

//TODO: Database file storage

import Store = require('jfs');
import path = require('path');
var gui = require('nw.gui');
var clipboard = gui.Clipboard.get();

interface ObjectConstructor {
  observe(beingObserved: any, callback: (update: any) => any): void;
  keys(array: Array < any > )
}

export class settings implements ObjectConstructor {
  private DEFAULT_SETTINGS = {
    launchOnStartup: false,
    checkUpdateOnLaunch: false,
    openLinksInBrowser: true,
    asMenuBarAppOSX: false,
    windowState: {},
  }
  private db;
  private settings;
  private watchers: Object;

  constructor() {
    this.db = new Store.Store(path.join(gui.App.dataPath, 'preferences.json'));
    this.settings = this.db.getSync('settings');
    this.setDefaultSettings();
    this.observeSettings();
  }

  public watch(name, callback: Function) {
    if (!Array.isArray(this.watchers[name])) {
      this.watchers[name] = [];
    }
    this.watchers[name].push(callback);
  }

  public observeSettings() {
    // Save settings every time a change is made and notify watchers
    Object.observe(this.settings, function (changes) {
      this.db.save('settings', settings, function (err) {
        if (err) {
          console.error('Could not save settings', err);
        }
      });

      changes.forEach(function (change) {
        var newValue = change.object[change.name];
        var keyWatchers = this.watchers[change.name];

        // Call all the watcher functions for the changed key
        if (keyWatchers && keyWatchers.length) {
          for (var i = 0; i < keyWatchers.length; i++) {
            try {
              keyWatchers[i](newValue);
            } catch (ex) {
              console.error(ex);
              keyWatchers.splice(i--, 1);
            }
          }
        }
      });
    });
  }


  // Ensure the default values exist
  public setDefaultSettings() {
    Object.keys(this.DEFAULT_SETTINGS).forEach(function (key) {
      if (!settings.hasOwnProperty(key)) {
        settings[key] = this.DEFAULT_SETTINGS[key];
      }
    });
  }
}
