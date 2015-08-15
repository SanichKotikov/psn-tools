'use strict';

let gui = require('nw.gui');
let https = require('https');
let fs = require('fs');
let path = require('path');

let Template = require('./dist/scripts/Template.js');
let GameCtrl = require('./dist/scripts/GameCtrl.js');
let NotificationCtrl = require('./dist/scripts/Notification.js');

global.window = window;
global.document = window.document;
global.DOMParser = DOMParser;
global.XMLSerializer = XMLSerializer;

global.gui = gui;
global.https = https;
global.fs = fs;
global.path = path;
global.Notification = Notification;

global.Chart = Chart;


class App
{
    PSN_API_URL = 'https://store.playstation.com/chihiro-api/viewfinder/RU/ru/999/';
    PSN_API_PARAMS = '?size=30&gkb=1&geoCountry=RU';

    win;
    template;
    gameCtrl;
    notification;

    constructor()
    {
        console.log(gui.App.dataPath);

        if (process.platform === 'darwin') this.initOsMenu();
        this.initOsTray();

        this.win = gui.Window.get();

        gui.App.on('reopen', () => this.show());
        this.win.on('close', () => this.hide());

        this.template = new Template();
        this.gameCtrl = new GameCtrl();
        this.notification = new NotificationCtrl();
    }

    initOsMenu()
    {
        let nativeMenuBar = new gui.Menu({ type: "menubar" });
        nativeMenuBar.createMacBuiltin("PSNtools");

        let win = gui.Window.get();
        win.menu = nativeMenuBar;
    }

    hide()
    {
        this.win.hide();
        this.win.setShowInTaskbar(false);
    }

    show()
    {
        this.win.show();
        this.win.setShowInTaskbar(true);
    }

    initOsTray()
    {
        let tray = new gui.Tray({
            //title: '',
            tooltip: 'psnTools',
            icon: 'images/tray.png'
        });

        let menu = new gui.Menu();

        let showItem = new gui.MenuItem({ label: 'Show Window...' });
        showItem.click = () => this.show();
        menu.append(showItem);

        menu.append(new gui.MenuItem({ type: 'separator' }));

        let quitItem = new gui.MenuItem({ label: 'Quit' });
        quitItem.click = () => gui.App.quit();
        menu.append(quitItem);

        tray.menu = menu;
    }
}

global.APP = new App();
