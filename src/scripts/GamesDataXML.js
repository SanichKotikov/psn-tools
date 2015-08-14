'use strict';

export default class GamesDataXML
{
    APP_DATA_FILE = gui.App.dataPath + path.sep + 'data.xml';

    read()
    {
        return new Promise((resolve, reject) => {

            fs.readFile(this.APP_DATA_FILE, 'utf-8', (error, data) => {

                if (error)
                {
                    reject(error);
                }
                else
                {
                    let xml = (new DOMParser()).parseFromString(data, 'text/xml');
                    let xmlGames = xml.querySelectorAll('Game');

                    let games = [];

                    for (let i = 0; i < xmlGames.length; i++)
                    {
                        let game = xmlGames[i];
                        let gameObject = {};

                        for (let j = 0; j < game.attributes.length; j++)
                        {
                            let attribute = game.attributes[j];
                            gameObject[attribute.name] = (attribute.value == 'null') ? null : attribute.value;
                        }

                        let history = [];
                        let historyItems = game.querySelectorAll('history item');

                        for (let h = 0; h < historyItems.length; h++)
                        {
                            let item = historyItems[h];
                            let historyItemObject = {};

                            for (let hi = 0; hi < item.attributes.length; hi++)
                            {
                                let attribute = item.attributes[hi];
                                historyItemObject[attribute.name] = (attribute.value == 'null') ? null : parseInt(attribute.value, 10);
                            }

                            history.push(historyItemObject);
                        }

                        gameObject.history = history;
                        games.push(gameObject);
                    }

                    resolve(games);
                }
            });
        });
    }

    write(games)
    {
        let xml = (new DOMParser()).parseFromString('<?xml version="1.0" encoding="UTF-8"?><Games></Games>', 'text/xml');
        let gamesTag = xml.querySelector('Games');

        games.forEach(gameObject => {

            let game = gameObject.model;
            let gameItem = xml.createElement('Game');

            for (let key in game)
            {
                if (!game.hasOwnProperty(key)) continue;

                if (key == 'history')
                {
                    let history = xml.createElement(key);
                    for (let h = 0; h < game[key].length; h++)
                    {
                        let historyItem = xml.createElement('item');
                        let item = game[key][h];

                        for (let itemKey in item)
                        {
                            if (!item.hasOwnProperty(itemKey)) continue;
                            historyItem.setAttribute(itemKey, item[itemKey]);
                        }

                        history.appendChild(historyItem);
                    }
                    gameItem.appendChild(history);
                }
                else
                {
                    gameItem.setAttribute(key, game[key]);
                }
            }

            gamesTag.appendChild(gameItem);
        });

        let xmlText = (new XMLSerializer()).serializeToString(xml);

        fs.writeFile(this.APP_DATA_FILE, xmlText, error => {
            if (error)
            {
                console.log(error);

                APP.notification.show({
                    title: 'Error',
                    message: error.message
                });
            }
        });
    }
}
