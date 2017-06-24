var a = 0;
var b = 0.5;
var Flame = function () {
    this.update = function() {
        // for the movement of the flame
        a = a + b;
        if (a >= 3) { b = -0.5; }
        if (a <= -3) { b = 0.5; }
    }
    this.draw = function (ctx) {
        //white part of flame
        ctx.beginPath();
        ctx.moveTo(206, 2 * CANVAS_HEIGHT / 3);
        ctx.quadraticCurveTo(200 + a, 40 - BLOCK_HEIGHT / 4, 207, 2 * CANVAS_HEIGHT / 3);
        ctx.closePath();
        ctx.fillStyle = "orange";
        ctx.fill();
        // blue part of flame
        ctx.beginPath();
        ctx.moveTo(194, 2 * CANVAS_HEIGHT / 3);
        ctx.quadraticCurveTo(200 + a, 60 - BLOCK_HEIGHT / 4, 206, 2 * CANVAS_HEIGHT / 3);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }

}