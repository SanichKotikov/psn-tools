'use strict';

export default class GamesWatcher
{
    INTERVAL_TIME = 1000 * 60 * 60 * 24; // 24h
    CHECK_INTERVAL_TIME = 1000 * 60 * 60 * 2; // 2h

    DELAY_MIN = 500; //ms
    DELAY_MAX = 3000; //ms

    gamesList;
    interval;

    updated;

    run(gamesList)
    {
        this.gamesList = gamesList;
        this.renderLastUpdate();
        this.updateData();

        this.interval = setInterval(() => this.updateData(), this.CHECK_INTERVAL_TIME);
    }

    gerRandomDelay()
    {
        return parseInt(Math.random() * (this.DELAY_MAX - this.DELAY_MIN) + this.DELAY_MIN, 10);
    }

    updateData(force = false)
    {
        this.updated = 0;

        return new Promise(resolve => {

            let nowTime = (new Date).getTime();
            let lastUpdate = window.localStorage.lastUpdateTime || null;

            if (!force && lastUpdate != null && (nowTime - parseInt(lastUpdate, 10)) < this.INTERVAL_TIME)
            {
                console.log('waiting...');
                return;
            }

            console.log('Update started');

            this.updateLastTime();
            let games = this.gamesList.items;
            let gamesCount = games.length;

            for (let i = 0; i < gamesCount; i++)
            {
                window.setTimeout(() => {

                    let game = games[i];
                    let oldPrice = game.model.price;
                    let oldPlusPrice = (game.model.plusPrice != null) ? game.model.plusPrice : null;

                    game.getData().then(() => {

                        game.updateModel();

                        if (oldPrice !== game.model.price || oldPlusPrice !== game.model.plusPrice)
                        {
                            game.pushHistory();

                            new Notification('Price updated!', {
                                icon: null,
                                body: `Game ${game.model.name} price updated!`
                            });
                        }

                        if (this.isUpdated()) {

                            console.log('Update ended');

                            APP.notification.show({
                                title: 'GamesWatcher',
                                message: 'All games have been updated!'
                            });

                            // update all games in any case
                            this.gamesList.toXml();

                            resolve();
                        }

                        console.log(this.updated, game.model.name);
                    });

                }, this.gerRandomDelay() * (i + 1));
            }
        });
    }

    isUpdated()
    {
        this.updated++;
        return this.gamesList.items.length === this.updated;
    }

    updateLastTime()
    {
        window.localStorage.lastUpdateTime = (new Date).getTime();
        this.renderLastUpdate();
    }

    renderLastUpdate()
    {
        let lastUpdate = window.localStorage.lastUpdateTime || null;

        if (lastUpdate != null)
        {
            let el = document.querySelector('#last-update');
            el.textContent = (new Date(parseInt(lastUpdate, 10))).toLocaleString();
        }
    }
}
