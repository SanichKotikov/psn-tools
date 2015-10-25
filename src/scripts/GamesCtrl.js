'use strict';

let GamesList = require('./GamesList.js');
let GameInfoCtrl = require('./GameInfoCtrl.js');
let GamesWatcher = require('./GamesWatcher.js');

export default class GamesCtrl
{
    ELEMENT_ID = '#game-list-wrapper';
    ELEMENT_LIST_ID = '#game-list';

    gamesList;
    gameInfoCtrl;
    gamesWatcher;

    el;
    list_el;

    constructor()
    {
        this.gamesList = new GamesList();
        this.gameInfoCtrl = new GameInfoCtrl();
        this.gamesWatcher = new GamesWatcher();

        this.el = document.querySelector(this.ELEMENT_ID);
        this.list_el = document.querySelector(this.ELEMENT_LIST_ID);

        this.bindEvents();

        this.gamesList.fromXml()
            .then(() => {
                this.renderList();
                this.gamesWatcher.run(this.gamesList);
            }, error => console.log(error.message, error)
        );
    }

    bindEvents()
    {
        this.el.addEventListener('click', event => {

            let target = event.target;

            if (target.getAttribute('data-id') == 'add')
            {
                this.onClickAdd();
            }
            else if (target.getAttribute('data-id') == 'update')
            {
                this.onClickUpdate();
            }
            else if (target.classList.contains('game-list__item-del'))
            {
                this.onClickDelete(target);
            }
            else if (target.classList.contains('game-list__item'))
            {
                this.onClickItem(target);
            }

        }, false);
    }

    onClickItem(target)
    {
        let id = target.getAttribute('id');
        let game = this.gamesList.item(id);

        if (game.model.deprecated)
        {
            //todo: не добавляет историю, если цена изменилась
            let input = window.prompt('This game is deprecated!\nInput new Game PSN ID');
            if (input)
            {
                game.model.oldId = game.model.id;
                game.model.id = input;
                this.gameInfoCtrl.load(game).then(() => {
                    delete game.model.oldId;
                    this.gamesList.toXml();
                });
            }
        }
        else
        {
            this.gameInfoCtrl.load(game);
        }
    }

    onClickDelete(target)
    {
        if (window.confirm('Are you sure?'))
        {
            let item = target.parentNode;
            let id = item.getAttribute('id');

            this.gamesList.remove(id)
                .then(() => {

                    this.list_el.removeChild(item);
                });
        }
    }

    onClickAdd()
    {
        let input = window.prompt('Input Game PSN ID');

        if (input)
        {
            this.gamesList.add(input)
                .then(game => {
                    this.list_el.appendChild(game.render());
                    this.gamesList.toXml();
                }, () => {
                    APP.notification.show({
                        title: 'Alert',
                        message: 'This game already added!'
                    });
                });
        }
    }

    onClickUpdate()
    {
        if (window.confirm('Force update?'))
        {
            this.gamesWatcher.updateData(true);
        }
    }

    renderList()
    {
        let fragment = document.createDocumentFragment();

        this.gamesList.items.forEach((game) => {
            fragment.appendChild(game.render());
        });

        this.list_el.innerHTML = '';
        this.list_el.appendChild(fragment);
    }
}
