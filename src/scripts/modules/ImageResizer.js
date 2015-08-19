'use strict';

export default class ImageResizer
{
    type;
    quality;
    width;
    height;

    constructor(options)
    {
        this.type = options.type;
        this.quality = options.quality;
        this.width = options.width;
        this.height = options.height;
    }

    resize(src)
    {
        return new Promise(resolve => {

            var img = new Image();

            img.onload = () => {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, this.height, this.height);

                var data = canvas.toDataURL(this.type, this.quality);
                resolve(data);
            };

            img.src = src;

        });
    }
}
