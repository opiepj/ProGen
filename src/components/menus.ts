/// <reference path="../typings/_custom.d.ts" />

import AutoLaunch = require('auto-launch');
import windowBehaviour = require('./window-behavior');
import dispatcher = require('./dispatcher');
import platform = require('./platform');
import settings = require('./settings');
import updater = require('./updater');

var gui = require('nw.gui');
var clipboard = gui.Clipboard.get();

export class menus {

	private platform;
	private updater;
	private settings;
	private windowBehaviour
	private dispatcher;

	constructor () {
		this.platform = new platform.platform();
		this.updater = new updater.updater();
		this.settings = new settings.settings();
		this.windowBehaviour = new windowBehaviour.windowBehaviour();
		this.dispatcher = new dispatcher.dispatcher();
	}

  public settingsItems(win, keep) {
		var self = this;
    return [{
      label: 'Reload',
      click: function () {
        this.windowBehaviour.saveWindowState(win);
        win.reload();
      }
    }, {
      type: 'checkbox',
      label: 'Open Links in the Browser',
      setting: 'openLinksInBrowser',
      click: function () {
        this.settings.openLinksInBrowser = this.checked;
        this.windowBehaviour.setNewWinPolicy(win);
      }
    }, {
      type: 'separator'
    }, {
      type: 'checkbox',
      label: 'Run as Menu Bar App',
      setting: 'asMenuBarAppOSX',
      platforms: ['osx'],
      click: function () {
        this.settings.asMenuBarAppOSX = this.checked;
        win.setShowInTaskbar(!this.checked);

        if (this.checked) {
          self.loadTrayIcon(win);
        } else if (win.tray) {
          win.tray.remove();
          win.tray = null;
        }
      }
    }, {
      type: 'checkbox',
      label: 'Launch on Startup',
      setting: 'launchOnStartup',
      platforms: ['osx', 'win'],
      click: function () {
        this.settings.launchOnStartup = this.checked;

        var launcher = new AutoLaunch({
          name: 'Starter',
          isHidden: true // hidden on launch - only works on a mac atm
        });

        launcher.isEnabled(function (enabled) {
          if (this.settings.launchOnStartup && !enabled) {
            launcher.enable(function (error) {
              if (error) {
                console.error(error);
              }
            });
          }

          if (!this.settings.launchOnStartup && enabled) {
            launcher.disable(function (error) {
              if (error) {
                console.error(error);
              }
            });
          }
        });
      }
    }, {
      type: 'checkbox',
      label: 'Check for Update on Launch',
      setting: 'checkUpdateOnLaunch'
    }, {
      type: 'separator'
    }, {
      label: 'Check for Update',
      click: function () {
        this.updater.check(gui.App.manifest, function (error, newVersionExists, newManifest) {
          if (error || newVersionExists) {
            this.updater.prompt(win, false, error, newVersionExists, newManifest);
          } else {
            this.dispatcher.trigger('win.alert', {
              win: win,
              message: 'You’re using the latest version: ' + gui.App.manifest.version
            });
          }
        });
      }
    }, {
      label: 'Launch Dev Tools',
      click: function () {
        win.showDevTools();
      }
    }].map(function (item) {
      // If the item has a 'setting' property, use some predefined values
      if (item.setting) {
        if (!item.hasOwnProperty('checked')) {
          item.checked = this.settings[item.setting];
        }

        if (!item.hasOwnProperty('click')) {
          item.click = function () {
            this.settings[item.setting] = item.checked;
          };
        }
      }

      return item;
    }).filter(function (item) {
      // Remove the item if the current platform is not supported
      return !Array.isArray(item.platforms) || (item.platforms.indexOf(this.platform.type) != -1);
    }).map(function (item) {
      var menuItem = new gui.MenuItem(item);
      menuItem.setting = item.setting;
      return menuItem;
    });
  }

  public loadMenuBar(win) {
		if (!this.platform.isOSX) {
      return;
    }

    var menu = new gui.Menu({
      type: 'menubar'
    });

    menu.createMacBuiltin('Starter');
    var submenu = menu.items[0].submenu;

    submenu.insert(new gui.MenuItem({
      type: 'separator'
    }), 1);

    // Add the main settings
    this.settingsItems(win, true).forEach(function(item, index) {
      submenu.insert(item, index + 2);
    });

    // Watch the items that have a 'setting' property
    submenu.items.forEach(function(item) {
      if (item.setting) {
        this.settings.watch(item.setting, function(value) {
          item.checked = value;
        });
      }
    });

    win.menu = menu;
  }

  public createTrayMenu(win) {
		var menu = new gui.Menu();

    // Add the main settings
    this.settingsItems(win, true).forEach(function(item) {
      menu.append(item);
    });

    menu.append(new gui.MenuItem({
      type: 'separator'
    }));

    menu.append(new gui.MenuItem({
      label: 'Show Starter',
      click: function() {
        win.show();
      }
    }));

    menu.append(new gui.MenuItem({
      label: 'Quit Starter',
      click: function() {
        win.close(true);
      }
    }));

    // Watch the items that have a 'setting' property
    menu.items.forEach(function(item) {
      if (item.setting) {
        this.settings.watch(item.setting, function(value) {
          item.checked = value;
        });
      }
    });

    return menu;
  }

  public loadTrayIcon(win) {
		if (win.tray) {
      win.tray.remove();
      win.tray = null;
    }

    var tray = new gui.Tray({
      icon: 'images/icon_' + (this.platform.isOSX ? 'menubar.tiff' : 'tray.png')
    });

    tray.on('click', function() {
      win.show();
    });

    tray.tooltip = 'Starter';
    tray.menu = this.createTrayMenu(win);

    // keep the object in memory
    win.tray = tray;
  }

  public createContextMenu(win, window, document, targetElement) {
		var menu = new gui.Menu();

    if (targetElement.tagName.toLowerCase() == 'input') {
      menu.append(new gui.MenuItem({
        label: "Cut",
        click: function() {
          clipboard.set(targetElement.value);
          targetElement.value = '';
        }
      }));

      menu.append(new gui.MenuItem({
        label: "Copy",
        click: function() {
          clipboard.set(targetElement.value);
        }
      }));

      menu.append(new gui.MenuItem({
        label: "Paste",
        click: function() {
          targetElement.value = clipboard.get();
        }
      }));
    } else if (targetElement.tagName.toLowerCase() == 'a') {
      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          clipboard.set(targetElement.href);
        }
      }));
    } else {
      var selection = window.getSelection().toString();
      if (selection.length > 0) {
        menu.append(new gui.MenuItem({
          label: "Copy",
          click: function() {
            clipboard.set(selection);
          }
        }));
      }
    }

    this.settingsItems(win, false).forEach(function(item) {
      menu.append(item);
    });

    return menu;
  }

  public injectContextMenu(win, window, document) {
		document.body.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      this.createContextMenu(win, window, document, event.target).popup(event.x, event.y);
      return false;
    }.bind(this));
  }
}
