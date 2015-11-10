/// <reference path="../typings/_custom.d.ts" />

//TODO: Database file storage

import jfs = require('jfs');
import path = require('path');
var Store = jfs.Store;
var gui: any = require('nw.gui');
var clipboard: any = gui.Clipboard.get();

interface ObjectConstructor {
  observe(beingObserved: any, callback: (update: any) => any): void;
  keys(array: Array<any>): void;
}

export class settings implements ObjectConstructor {
  private DEFAULT_SETTINGS: any = {
    launchOnStartup: false,
    checkUpdateOnLaunch: false,
    openLinksInBrowser: true,
    asMenuBarAppOSX: false,
    windowState: {},
  }
  private db: any;
  private settings: any;
  private watchers: any;

  constructor() {
    this.db = new Store(path.join(gui.App.dataPath, 'preferences.json'));
    this.settings = this.db.getSync('settings');
    this.setDefaultSettings();
    this.observeSettings();
  }

  public watch(name: string, callback: Function) {
    if (!Array.isArray(this.watchers[name])) {
      this.watchers[name] = [];
    }
    this.watchers[name].push(callback);
  }

  public observeSettings() {
    // Save settings every time a change is made and notify watchers
    Object.observe(this.settings, function (changes: any) {
      this.db.save('settings', this.settings, function (err: Error) {
        if (err) {
          console.error('Could not save settings', err);
        }
      });

      changes.forEach(function (change: any) {
        var newValue: any = change.object[change.name];
        var keyWatchers: any = this.watchers[change.name];

        // Call all the watcher functions for the changed key
        if (keyWatchers && keyWatchers.length) {
          for (var i: number = 0; i < keyWatchers.length; i++) {
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
    Object.keys(this.DEFAULT_SETTINGS).forEach(function (key: any) {
      if (!this.settings.hasOwnProperty(key)) {
        this.settings[key] = this.DEFAULT_SETTINGS[key];
      }
    });
  }
}
