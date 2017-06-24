

var coinImage = new Image();
coinImage.src = "./sprites/coin.png";

var Coin = function (x, y) {
    this.x = x;
    this.y = y;
    this.coin = sprite({
        x : this.x,
        y : this.y,
        width: 440,
        height: 120,
        image: coinImage,
        ticksPerFrame: 5,
        numberOfFrames: 10
    });
    this.active = true;
    this.update = function() {
        this.coin.update();
        if (this.coin.x < 0) {
            this.active = false;
        }
    };
    this.render = function (ctx) {
        this.coin.render(ctx);
    }
    this.touches = function (x, y, tolerance) {
        if (this.coin.touches(x, y, tolerance)) {
            this.active = false;
            return true;
        }
        return false;
    }
}