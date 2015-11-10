/// <reference path="typings/_custom.d.ts" />

import platform = require('./components/platform');
import updater = require('./components/updater');
import menus = require('./components/menus');
import settings = require('./components/settings');
import windowBehaviour = require('./components/window-behavior');
import dispatcher = require('./components/dispatcher');

var gui = require('nw.gui');
var win = gui.Window.get();

export module ProGen {
  var platform: any = new platform.platform();
  var updater: any = new updater.updater();
  var menus: any = new menus.menus();
  var settings: any = new settings.settings();
  var windowBehaviour: any = new windowBehaviour.windowBehaviour();
  var dispatcher: any = new dispatcher.dispatcher();

  // Ensure there's an app shortcut for toast notifications to work on Windows
  if (platform.isWindows) {
    gui.App.createShortcut(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\ProGen.lnk");
  }

  // Add dispatcher events
  dispatcher.addEventListener('win.alert', function (data: any) {
    data.win.window.alert(data.message);
  });

  dispatcher.addEventListener('win.confirm', function (data: any) {
    data.callback(data.win.window.confirm(data.message));
  });

  // Window state
  windowBehaviour.restoreWindowState(win);
  windowBehaviour.bindWindowStateEvents(win);

  // Check for update
  if (settings.checkUpdateOnLaunch) {
    updater.checkAndPrompt(gui.App.manifest, win);
  }

  // Run as menu bar app
  if (settings.asMenuBarAppOSX) {
    win.setShowInTaskbar(false);
    menus.loadTrayIcon(win);
  }

  // Load the app menus
  menus.loadMenuBar(win)
  if (platform.isWindows) {
    menus.loadTrayIcon(win);
  }

  // Adjust the default behaviour of the main window
  windowBehaviour.set(win);
  windowBehaviour.setNewWinPolicy(win);

  // Add a context menu
  menus.injectContextMenu(win, window, document);

  // Reload the app periodically until it loads
  var reloadIntervalId = setInterval(function () {
    if (win.window.navigator.onLine) {
      clearInterval(reloadIntervalId);
    } else {
      win.reload();
    }
  }, 10 * 1000);
}
