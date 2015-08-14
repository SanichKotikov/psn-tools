'use strict';

let GamesDataXML = require('./GamesDataXML.js');
let Game = require('./Game.js');

export default class GameList
{
    items;
    dataXml;

    constructor()
    {
        this.items = [];
        this.dataXml = new GamesDataXML();
    }

    fromXml()
    {
        return new Promise((resolve, reject) => {

            this.dataXml.read().then(games => {
                this.load(games).then(() => resolve());
            }, error => reject(error));

        });
    }

    toXml()
    {
        this.dataXml.write(this.items);
    }

    load(games)
    {
        return new Promise(resolve => {
            games.forEach(game => this.items.push(new Game(game)));
            resolve();
        });
    }

    add(id)
    {
        return new Promise((resolve, reject) => {

            if (this.item(id) != null)
            {
                reject();
            }
            else
            {
                let newGame = new Game({ id: id });
                this.items.push(newGame);

                newGame.getData().then(() => {

                    newGame.updateModel();
                    resolve(newGame);

                }, error => {
                    console.error(error.message, error);

                    APP.notification.show({
                        title: 'Error',
                        message: error.message
                    });
                });
            }
        });
    }

    remove(id)
    {
        return new Promise(resolve => {

            for (let i = 0; i < this.items.length; i++)
            {
                let game = this.items[i];
                if (game.model.id == id)
                {
                    this.items.splice(i, 1);
                    break;
                }
            }

            this.toXml();
            resolve();

        });
    }

    item(id)
    {
        for (let i = 0; i < this.items.length; i++)
        {
            let game = this.items[i];
            if (game.model.id == id)
            {
                return game;
            }
        }

        return null;
    }
}
