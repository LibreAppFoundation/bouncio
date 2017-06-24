var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var BLOCK_COL_COUNT = 5;
var BLOCK_ROW_COUNT = 4;
var BLOCK_WIDTH;
var BLOCK_HEIGHT;
var FPS = 60;
var SPEED = 10;
var JUMP_SPEED = 5;
var BLOCK_HOR_OFFSET = 0;
var BLOCK_VER_OFFSET = 0;
var spacebarHit;
var BALL_RADIUS;
var RIPLE_RADIUS = 100;
var RIPLE_OFFSET = 0;
var CLOUD_OFFSET = -1;
var CLOUD_ACTIVE = false;
var GAP_OFFSET = 0;
var GAP_ACTIVE = false;
var BALL_FALLEN = false;
var BALL_BASE = 2;
var coins = [];
var SCORE;
var HIGHSCORE = 0;

function reset(canvas, ctx) {
    BALL_BASE = 0;
    SPEED = 2;
    BLOCK_HOR_OFFSET = 0;
    BLOCK_VER_OFFSET = 0;
    RIPLE_OFFSET = 0;
    CLOUD_OFFSET = -1;
    CLOUD_ACTIVE = false;
    GAP_ACTIVE = false;
    BALL_FALLEN = false;
    SCORE = 0;
    CANVAS_WIDTH = window.innerWidth - 20;
    CANVAS_HEIGHT = window.innerHeight - 20;
    $(canvas).attr("height", CANVAS_HEIGHT);
    $(canvas).attr("width", CANVAS_WIDTH);
    BLOCK_WIDTH = CANVAS_WIDTH / BLOCK_COL_COUNT;
    BLOCK_HEIGHT = CANVAS_HEIGHT / (3 * BLOCK_ROW_COUNT);
    BALL_RADIUS = BLOCK_HEIGHT;
    BLOCK_HOR_OFFSET = BLOCK_WIDTH / 2;
    BALL_Y = 2 * CANVAS_HEIGHT / 3;
}

function drawCloud(ctx) {
    if (!CLOUD_ACTIVE) return;
    var startX = CLOUD_OFFSET;
    var startY = BLOCK_HEIGHT;
    ctx.fillStyle = "#ddd";

    // draw cloud shape
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX - 20, startY + 5, startX - 20, startY + 80, startX + 30, startY + 35);
    ctx.bezierCurveTo(startX + 50, startY + 50, startX + 70, startY + 50, startX + 75, startY + 35);
    ctx.bezierCurveTo(startX + 140, startY + 30, startX + 120, startY + 20, startX + 110, startY + 10);
    ctx.bezierCurveTo(startX + 180, startY - 20, startX + 110, startY - 20, startX + 80, startY - 15);
    ctx.bezierCurveTo(startX + 70, startY - 30, startX + 40, startY - 30, startX + 35, startY - 15);
    ctx.bezierCurveTo(startX + 10, startY - 35, startX - 5, startY - 30, startX, startY);
    ctx.fill();
    ctx.closePath();
}

function drawWater(ctx) {
    ctx.fillStyle = "#4169e1";
    ctx.beginPath();
    for (var i = -1; i < CANVAS_WIDTH / (RIPLE_RADIUS * 4 / 5) + 4; i++) {
        ctx.arc(i * RIPLE_RADIUS * 4 / 5 - RIPLE_OFFSET, CANVAS_HEIGHT + RIPLE_RADIUS * 4 / 5, RIPLE_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.closePath();
}

function drawBall(ctx) {
    ctx.fillStyle = "#8b0000";
    ctx.strokeStyle = "000";
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT - BLOCK_ROW_COUNT * BLOCK_HEIGHT - BALL_RADIUS - BLOCK_VER_OFFSET, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawGap(ctx) {
    if (!GAP_ACTIVE) return;
    ctx.beginPath();
    ctx.fillStyle = "skyblue";
    ctx.strokeStyle = "skyblue";
    ctx.rect(GAP_OFFSET, CANVAS_HEIGHT - BLOCK_ROW_COUNT * BLOCK_HEIGHT - 2, 3 * BALL_RADIUS, BLOCK_ROW_COUNT * BLOCK_HEIGHT);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawBlocks(ctx) {
    ctx.fillStyle = "#708090";
    ctx.strokeStyle = "black";
    ctx.lineWidth = "1";
    ctx.beginPath();
    for (var i = 0; i < BLOCK_ROW_COUNT; i++) {
        var offset;
        if (i % 2) {
            offset = (BLOCK_HOR_OFFSET + BLOCK_WIDTH / 2) % BLOCK_WIDTH;
        } else {
            offset = BLOCK_HOR_OFFSET;
        }
        for (j = 0; j < BLOCK_COL_COUNT + 1; j++) {

            ctx.rect(j * BLOCK_WIDTH - offset, CANVAS_HEIGHT - (i + 1) * BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.closePath();

}

function drawScore(ctx) {
    ctx.beginPath();
    ctx.font = '16px serif';
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("SCORE : " + SCORE, 0, 20);
    ctx.fillText("HIGH SCORE : " + HIGHSCORE, 0, 40);
    ctx.closePath();
}

function drawGameOver(ctx) {
    if (BALL_FALLEN) {
        ctx.beginPath();
        ctx.font = '48px serif';
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.closePath();
    }
}

function draw(ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBlocks(ctx);
    drawGap(ctx);
    drawBall(ctx);
    drawWater(ctx);
    drawCloud(ctx);

    // Render coins
    for (var i = 0; i < coins.length; i++) {
        coins[i].render(ctx);
    }
    drawScore(ctx);
    drawGameOver(ctx);
}

function update() {

    if (spacebarHit) {
        if (BLOCK_VER_OFFSET < 2 * CANVAS_HEIGHT / 3 - 2 * BALL_RADIUS) {
            BLOCK_VER_OFFSET += JUMP_SPEED;
        } else {
            spacebarHit = false;
        }
    } else {
        if (BLOCK_VER_OFFSET > 0) {
            BLOCK_VER_OFFSET -= JUMP_SPEED;
        }
    }

    RIPLE_OFFSET -= 1;
    if (RIPLE_OFFSET < - RIPLE_RADIUS * 4 / 5) {
        RIPLE_OFFSET = 0;
    }

    if (!CLOUD_ACTIVE && Math.random() < 0.01) {
        CLOUD_ACTIVE = true;
        CLOUD_OFFSET = -140;
    } else if (CLOUD_ACTIVE) {
        CLOUD_OFFSET += 1;
        if (CLOUD_OFFSET > CANVAS_WIDTH + 20) {
            CLOUD_ACTIVE = false;
        }
    }

    // Update gap
    if (!GAP_ACTIVE && Math.random() < 0.005) {
        GAP_ACTIVE = true;
        GAP_OFFSET = CANVAS_WIDTH + BALL_RADIUS;
    } else if (GAP_ACTIVE) {
        GAP_OFFSET -= SPEED;
        if (GAP_OFFSET < - 3 * BALL_RADIUS) {
            GAP_ACTIVE = false;
        }
    }

    BLOCK_HOR_OFFSET = (BLOCK_HOR_OFFSET + SPEED) % BLOCK_WIDTH;

    // Check if ball has fallen
    if (GAP_ACTIVE && BLOCK_VER_OFFSET == 0 && CANVAS_WIDTH / 2 - BALL_RADIUS > GAP_OFFSET && CANVAS_WIDTH / 2 + BALL_RADIUS < GAP_OFFSET + 3 * BALL_RADIUS) {
        BALL_FALLEN = true;
    }

    // Add && update coins
    if (Math.random() < 0.01) {
        coins.push(new Coin(CANVAS_WIDTH, Math.ceil(Math.random() * 2 * CANVAS_HEIGHT / 3)));
    }
    var newCoinArray = [];
    for (var i = 0; i < coins.length; i++) {
        var coin = coins[i];
        coin.update();
        if (coin.touches(CANVAS_WIDTH / 2, CANVAS_HEIGHT - BLOCK_ROW_COUNT * BLOCK_HEIGHT - BALL_RADIUS - BLOCK_VER_OFFSET, BALL_RADIUS)) {
            SCORE = SCORE + 5;
            if (SCORE > HIGHSCORE) {
                HIGHSCORE = SCORE;
            }
            if (SCORE % 20 == 0) {
                SPEED++;
            }
        }
        if (coin.active) {
            newCoinArray.push(coin);
        }
    }
    coins = newCoinArray;
}

function updateBallFall() {
    if (BLOCK_VER_OFFSET > - (BLOCK_ROW_COUNT * BLOCK_HEIGHT + BALL_RADIUS)) {
        BLOCK_VER_OFFSET -= 5;
    } else {
        reset();
    }
}

function keydownEvent(event) {
  if (event.keyCode == 32 && !spacebarHit) {
    spacebarHit = true;
  }
}

function keyupEvent(event) {
  if (event.keyCode == 32 && spacebarHit) {
    spacebarHit = false;
  }
}

function touchStartEvent(event) {
  if (!spacebarHit) {
    spacebarHit = true;
  }
}

function touchEndEvent(event) {
  if (spacebarHit) {
    spacebarHit = false;
  }
}

$(function () {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');

    reset(canvas, ctx);

    // Event handlers;
    $(document).keydown(keydownEvent);
    $(document).keyup(keyupEvent);
    $(document).on('touchstart', touchStartEvent);
    $(document).on('touchend', touchEndEvent);


    function gameLoop() {
        if (BALL_FALLEN) {
            updateBallFall();
        } else {
            update();
        }
        draw(ctx);
        setTimeout(gameLoop, 1000 / FPS);
    }

    gameLoop();


});
