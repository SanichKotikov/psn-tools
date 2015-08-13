'use strict';

let GameList = require('./GameList.js');
let GameInfoCtrl = require('./GameInfoCtrl.js');
let GamesWatcher = require('./GamesWatcher.js');

export default class GameCtrl
{
    ELEMENT_ID = '#game-list-wrapper';
    ELEMENT_LIST_ID = '#game-list';

    gameList;
    gameInfoCtrl;
    gamesWatcher;

    el;
    list_el;

    constructor()
    {
        this.gameList = new GameList();
        this.gameInfoCtrl = new GameInfoCtrl();
        this.gamesWatcher = new GamesWatcher();

        this.el = document.querySelector(this.ELEMENT_ID);
        this.list_el = document.querySelector(this.ELEMENT_LIST_ID);

        this.bindEvents();

        this.gameList.fromXml()
            .then(() => {
                this.renderList();
                this.gamesWatcher.run(this.gameList);
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
        let game = this.gameList.item(id);

        this.gameInfoCtrl.load(game);
    }

    onClickDelete(target)
    {
        if (window.confirm('Are you sure?'))
        {
            let item = target.parentNode;
            let id = item.getAttribute('id');

            this.gameList.remove(id)
                .then(() => {

                    this.list_el.removeChild(item);
                });
        }
    }

    onClickAdd()
    {
        let input = prompt('Input Game ID');

        if (input)
        {
            this.gameList.add(input)
                .then(game => {
                    this.list_el.appendChild(game.render());
                    this.gameList.toXml();
                }, () => {
                    window.alert('This game already added!');
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

        this.gameList.items.forEach((game) => {
            fragment.appendChild(game.render());
        });

        this.list_el.innerHTML = '';
        this.list_el.appendChild(fragment);
    }
}
