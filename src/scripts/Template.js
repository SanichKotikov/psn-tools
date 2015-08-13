'use strict';

export default class Template
{
    ELEMENT_ID = '#templates';
    el;

    constructor()
    {
        this.el = document.querySelector(this.ELEMENT_ID);
    }

    getHtml(id)
    {
        let template = this.el.querySelector(id);
        return template.innerHTML;
    }

    render(id, model)
    {
        let html = this.getHtml(id);
        let fragment = document.createElement('div');

        for (let key in model)
        {
            if (!model.hasOwnProperty(key)) continue;
            html = html.replace(new RegExp('\{' + key + '\}', 'gi'), model[key]);
        }

        fragment.innerHTML = html;
        return fragment.children[0];
    }

    each(id, modelList)
    {
        let fragment = document.createDocumentFragment();
        modelList.forEach(model => fragment.appendChild(this.render(id, model)));
        return fragment;
    }
}
