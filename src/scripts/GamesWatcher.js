'use strict';

export default class GamesWatcher
{
    INTERVAL_TIME = 1000 * 60 * 60 * 24; // 24h
    CHECK_INTERVAL_TIME = 1000 * 60 * 60 * 2; // 2h

    gameList;
    interval;

    run(gameList)
    {
        this.gameList = gameList;
        this.updateData();

        this.interval = setInterval(() => this.updateData(), this.CHECK_INTERVAL_TIME);
    }

    updateData(force = false)
    {
        let nowTime = (new Date).getTime();
        let lastUpdate = window.localStorage.lastUpdateTime || null;

        if (!force && lastUpdate != null && (nowTime - parseInt(lastUpdate, 10)) < this.INTERVAL_TIME)
        {
            console.log('waiting...');
            return;
        }

        this.updateLastTime();
        let games = this.gameList.items;

        for (let i = 0; i < games.length; i++)
        {
            let game = games[i];
            let oldPrice = parseInt(game.model.price, 10);
            let oldPlusPrice = (game.model.plusPrice != null) ? parseInt(game.model.plusPrice, 10) : null;

            game.getData().then(() => {

                game.updateModel();

                if (oldPrice !== game.model.price || oldPlusPrice !== game.model.plusPrice)
                {
                    game.pushHistory();
                    this.gameList.toXml();

                    new Notification('Price updated!', {
                        icon: null,
                        body: `Game ${game.model.name} price updated!`
                    });
                }
            });
        }
    }

    updateLastTime()
    {
        window.localStorage.lastUpdateTime = (new Date).getTime();
    }
}
