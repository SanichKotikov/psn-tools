'use strict';

export default class GameModel
{
    id;
    name;
    cover;
    price;
    plusPrice;
    deprecated;
    history;

    constructor(data)
    {
        this.id = data.id || null;
        this.name = data.name || null;
        this.cover = data.cover || null;
        this.price = data.price ? parseInt(data.price, 10) : null;
        this.plusPrice = data.plusPrice ? parseInt(data.plusPrice, 10) : null;
        this.deprecated = data.deprecated && data.deprecated == 'true' ? true : false;
        this.history = data.history || [];
    }

    update(json)
    {
        if (!json.default_sku) {
            this.deprecated = true;
            return;
        }

        const now = new Date();
        const sku = json.default_sku;
        let hasPlusReward = false;

        this.name = json.name;
        this.cover = json.images[0].base64;
        this.price = sku.price;
        this.deprecated = false;

        if (sku.rewards && sku.rewards.length)
        {
            for (let i = 0; i < sku.rewards.length; i++)
            {
                let reward = sku.rewards[i];
                if (reward.isPlus)
                {
                    this.plusPrice = reward.price;
                    hasPlusReward = true;
                }
                else if (reward.campaigns && reward.campaigns.length && reward.campaigns[0])
                {
                    const campaign = reward.campaigns[0];
                    if (now > new Date(campaign.start_date) && now < new Date(campaign.end_date))
                    {
                        this.price = reward.price;
                        if (reward.bonus_price)
                        {
                            this.plusPrice = reward.bonus_price;
                            hasPlusReward = true;
                        }
                    }
                }
            }
        }

        if (!hasPlusReward) this.plusPrice = null;

        if (this.history.length === 0)
        {
            this.pushHistory();
        }
    }

    pushHistory()
    {
        this.history.push({
            date: (new Date).getTime(),
            price: this.price,
            plusPrice: this.plusPrice
        });
    }
}
