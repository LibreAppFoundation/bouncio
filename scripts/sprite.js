function sprite(options) {

    var that = {};
    that.x = options.x;
    that.y = options.y;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;
    that.render = function (ctx) {
        var ratio = that.height * numberOfFrames / that.width;
        // Draw the animation
        ctx.drawImage(
            that.image,
            frameIndex * that.width / numberOfFrames,
            0,
            that.width / numberOfFrames,
            that.height,
            that.x,
            that.y,
            2 * BALL_RADIUS,
            2 * BALL_RADIUS * ratio);
    };
    that.update = function () {

        that.x -= SPEED;
        
        tickCount += 1;

        if (tickCount > ticksPerFrame) {

            tickCount = 0;

            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    };
    that.touches = function(x, y, tolerance) {
        return x > (that.x - tolerance) && x < (that.x + 3 * tolerance) && y < (that.y + 3 * tolerance) && y > (that.y - tolerance);
    }
    return that;
}