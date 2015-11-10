/// <reference path="../typings/_custom.d.ts" />

import platform = require('./platform');
import settings = require('./settings');

var gui: any = require('nw.gui');

export class windowBehaviour {
  private platform;
  private settings;

  constructor() {
    this.platform = new platform.platform();
    this.settings = new settings.settings();
  }

  public set(win) {
    // Show the window when the dock icon is pressed
    gui.App.removeAllListeners('reopen');
    gui.App.on('reopen', function () {
      win.show();
    });

    // Don't quit the app when the window is closed
    if (!this.platform.isLinux) {
      win.removeAllListeners('close');
      win.on('close', function (quit: any) {
        if (quit) {
          this.saveWindowState(win);
          win.close(true);
        } else {
          win.hide();
        }
      }.bind(this));
    }
  }

  /**
   * Change the new window policy to open links in the browser or another window.
   */
  public setNewWinPolicy(win: any) {
    win.removeAllListeners('new-win-policy');
    win.on('new-win-policy', function (frame: any, url: string, policy: any) {
      if (this.settings.openLinksInBrowser) {
        gui.Shell.openExternal(url);
        policy.ignore();
      } else {
        policy.forceNewWindow();
      }
    });
  }

  /**
   * Listen for window state events.
   */
  public bindWindowStateEvents(win: any) {
    win.removeAllListeners('maximize');
    win.on('maximize', function () {
      win.sizeMode = 'maximized';
    });

    win.removeAllListeners('unmaximize');
    win.on('unmaximize', function () {
      win.sizeMode = 'normal';
    });

    win.removeAllListeners('minimize');
    win.on('minimize', function () {
      win.sizeMode = 'minimized';
    });

    win.removeAllListeners('restore');
    win.on('restore', function () {
      win.sizeMode = 'normal';
    });
  }

  /**
   * Store the window state.
   */
  public saveWindowState(win: any) {
    var state: any = {
      mode: win.sizeMode || 'normal'
    };

    if (state.mode == 'normal') {
      state.x = win.x;
      state.y = win.y;
      state.width = win.width;
      state.height = win.height;
    }

    this.settings.windowState = state;
  }

  /**
   * Restore the window size and position.
   */
  public restoreWindowState(win: any) {
    var state: any = this.settings.windowState;

    if (state.mode == 'maximized') {
      win.maximize();
    } else {
      win.resizeTo(state.width, state.height);
      win.moveTo(state.x, state.y);
    }

    win.show();
  }

}
