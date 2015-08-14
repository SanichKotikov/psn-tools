'use strict';

let GameModel = require('./GameModel.js');

export default class Game
{
    el;
    model;
    json;

    constructor(data)
    {
        this.model = new GameModel(data);
        this.json = {};
    }

    getData()
    {
        return new Promise((resolve, reject) => {

            let url = APP.PSN_API_URL + this.model.id + APP.PSN_API_PARAMS;

            let debug = document.querySelector('#debug');
            debug.textContent = (parseInt(debug.textContent, 10) + 1).toString();

            https.get(url, response => {

                let res_data = '';
                response.on('data', chunk => res_data += chunk);
                response.on('end', () => {
                    this.json = JSON.parse(res_data);
                    resolve();
                });

            }).on('error', error => reject(error));
        });
    }

    updateModel()
    {
        this.model.update(this.json);

        // update item in list
        let item = document.getElementById(this.model.id);
        if (item) item.parentNode.replaceChild(this.render(), item);
    }

    pushHistory()
    {
        this.model.pushHistory();
    }

    formatePrice(num)
    {
        return (num == null) ? '–' : (num / 100) + ' \u20bd';
    }

    render()
    {
        this.el = APP.template.render('#gameListItem', {
            id: this.model.id,
            name: this.model.name,
            price: this.model.price !== null ? this.formatePrice(this.model.price) : '',
            plusPrice: this.model.plusPrice !== null ? this.formatePrice(this.model.plusPrice) : ''
        });

        return this.el;
    }

    renderInfo()
    {
        //let platforms = this.json.playable_platform;
        //
        //if (platforms)
        //{
        //    platforms.forEach(platform => {
        //        title.appendChild(createEl('div', { 'class': 'game-info__platform' }, platform));
        //    });
        //}

        return APP.template.render('#gameInfo', {
            //platform: '',
            name: this.model.name,
            src: `src="${this.json.images[0].url}"`,
            desc: this.json.long_desc
        });
    }
}
