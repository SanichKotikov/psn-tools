'use strict';

export default class Notification
{
    ELEMENT_ID = '#notifications-wrapper';
    TEMPLATE_ID = '#notification';

    el;

    constructor()
    {
        this.el = document.querySelector(this.ELEMENT_ID);
    }

    show(model)
    {
        let notify = APP.template.render(this.TEMPLATE_ID, model);
        this.el.appendChild(notify);

        window.setTimeout(() => {
            notify.classList.add('display');
        }, 300);

        window.setTimeout(() => {
            notify.addEventListener('transitionend', () => this.el.removeChild(notify), false);
            notify.classList.remove('display');
        }, 1000 * 6);
    }
}
