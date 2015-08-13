'use strict';

export default class GameInfoCtrl
{
    ELEMENT_INFO_ID = '#game-info';

    game;
    el;

    constructor()
    {
        this.el = document.querySelector(this.ELEMENT_INFO_ID);
    }

    load(game)
    {
        this.game = game;
        this.render();
    }

    render()
    {
        this.el.innerHTML = '';
        this.el.appendChild(this.renderLoader());

        this.game.getData().then(() => {
            this.game.updateModel();

            this.el.innerHTML = '';
            this.el.appendChild(this.game.renderInfo());

            this.renderChart();
        });
    }

    renderChart()
    {
        let labels = [];
        let priceData = [];
        let plusData = [];

        this.game.model.history.forEach(item => {
            labels.push((new Date(item.date)).toLocaleDateString());
            priceData.push(item.price / 100);
            plusData.push(item.plusPrice != null ? item.plusPrice / 100 : 0);
        });

        let historyData = {
            labels : labels,
            datasets : [
                {
                    label: 'price',
                    fillColor : "rgba(255,140,120,0.1)",
                    strokeColor : "rgba(255,140,120,1)",
                    pointColor : "rgba(255,140,120,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(255,140,120,1)",
                    data : priceData
                },
                {
                    label: 'plus',
                    fillColor : "rgba(255,190,0,0.1)",
                    strokeColor : "rgba(255,190,0,1)",
                    pointColor : "rgba(255,190,0,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(255,190,0,1)",
                    data : plusData
                }
            ]
        };

        let ctx = document.querySelector('#history').getContext("2d");
        new Chart(ctx).Line(historyData, {
            responsive: true,
            bezierCurve: false
        });
    }

    renderLoader()
    {
        let loader = document.createElement('div');
        loader.className = 'loader';
        loader.textContent = 'loading...';

        return loader;
    }
}
