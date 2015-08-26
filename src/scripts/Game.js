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
                    let json_data = JSON.parse(res_data);

                    if (json_data.errorCode)
                    {
                        reject(json_data);
                    }
                    else
                    {
                        this.json = json_data;
                        this.getImage().then(() => resolve());
                    }
                });

            }).on('error', error => reject(error));
        });
    }

    getImage()
    {
        return new Promise(resolve => {

            let coverUrl = this.json.images[0].url;

            http.get(coverUrl, response => {

                var image_data = [];
                response.setEncoding('binary');

                response.on('data', chunk => {
                    for (var i = 0; i < chunk.length; i++) {
                        image_data.push(chunk.charCodeAt(i));
                    }
                });
                response.on('end', () => {

                    let type = response.headers['content-type'];
                    let base64 = `data:${type};base64,` + new Buffer(image_data).toString('base64');

                    APP.imageResizer.resize(base64).then(data => {
                        this.json.images[0].base64 = data;
                        resolve();
                    });

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

    markAsDeprecated()
    {
        this.model.deprecated = true;
    }

    formatPrice(num)
    {
        return (num == null) ? '–' : (num / 100) + ' \u20bd';
    }

    formatPercent()
    {
        let length = this.model.history.length;

        if (length > 1)
        {
            let previous = this.model.history[length - 2];

            let price = this.model.price !== null ? this.model.price : 0;
            let plus = this.model.plusPrice !== null ? this.model.plusPrice : 0;

            let oldPrice = previous.price !== null ? previous.price : 0;
            let oldPlus = previous.plusPrice !== null ? previous.plusPrice : 0;

            let priceDiff = '–';
            let plusDiff = '–';

            if (price != oldPrice)
            {
                priceDiff = parseInt(((oldPrice - price) / oldPrice) * 100, 10) * -1 + '%';
            }

            if (plus != oldPlus)
            {
                plusDiff = parseInt(((oldPlus - plus) / oldPlus) * 100, 10) * -1 + '%';
            }

            return `( ${priceDiff} / ${plusDiff} )`;
        }

        return '';
    }

    render()
    {
        this.el = APP.template.render('#gameListItem', {
            id: this.model.id,
            class: this.model.deprecated ? 'deprecated' : '',
            name: this.model.name,
            cover: this.model.cover ? `src="${this.model.cover}"` : '',
            price: this.model.price !== null ? this.formatPrice(this.model.price) : '',
            plusPrice: this.model.plusPrice !== null ? this.formatPrice(this.model.plusPrice) : '',
            percent: this.formatPercent()
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
