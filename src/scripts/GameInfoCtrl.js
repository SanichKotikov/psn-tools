'use strict';

export default class GameInfoCtrl
{
    ELEMENT_INFO_ID = '#game-info';
    TIMER_CLASS = '.js-game-timer';

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
            this.renderTimer();
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

    renderTimer()
    {
        if (!this.game.json.release_date) return;

        let release_date = new Date(this.game.json.release_date);
        if (release_date <= new Date()) return;

        let second = 1000;
        let minute = second * 60;
        let hour = minute * 60;
        let day = hour * 24;

        let timer_el = this.el.querySelector(this.TIMER_CLASS);

        let timer = window.setInterval(() => {

            let now = new Date();
            let distance = release_date - now;

            if (distance < 0)
            {
                window.clearInterval(timer);
                timer_el.textContent = 'Released!';
                return;
            }

            let days = Math.floor(distance / day);

            let hours = Math.floor((distance % day) / hour);
            if (hours < 10) hours = `0${hours}`;

            let minutes = Math.floor((distance % hour) / minute);
            if (minutes < 10) minutes = `0${minutes}`;

            let seconds = Math.floor((distance % minute) / second);
            if (seconds < 10) seconds = `0${seconds}`;

            timer_el.textContent = `${days} ${hours}:${minutes}:${seconds}`;

        }, 1000);
    }

    renderLoader()
    {
        let loader = document.createElement('div');
        loader.className = 'loader';
        loader.textContent = 'loading...';

        return loader;
    }
}
