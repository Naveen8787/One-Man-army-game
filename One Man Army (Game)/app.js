window.addEventListener("load", function() {
    
    one = new Audio('./audio/pink.mp3');
    one.loop = true;
    one.play();
    //constants
    var GAME_WIDTH = 1080;
    var GAME_HEIGHT = 580;

    //keep the game going
    var gameLive = true;

    //current level
    var level = 1;
    var life = 5;

    //enemies
    var enemies = [{
        x: 160, //x coordinate
        y: 100, //y coordinate
        speedY: 2, //speed in Y
        w: 40, //width
        h: 40 //heght
    }, {
        x: 320,
        y: 0,
        speedY: 2,
        w: 40,
        h: 40
    }, {
        x: 480,
        y: 100,
        speedY: 3,
        w: 40,
        h: 40
    }, {
        x: 640,
        y: 100,
        speedY: -3,
        w: 40,
        h: 40
    }, {
        x: 800,
        y: 0,
        speedY: 2,
        w: 40,
        h: 40
    }];

    //the player object
    var player = {
        x: 10,
        y: 260,
        speedX: 2,
        isMoving: false, //keep track whether the player is moving or not
        w: 50,
        h: 50
    };

    //the goal object
    var goal = {
        x: 980,
        y: 240,
        w: 90,
        h: 90
    }

    var sprites = {};

    var movePlayer = function() {
        one = new Audio('./audio/foot.mp3');
        one.play();
        player.isMoving = true;
    }

    var stopPlayer = function() {
        player.isMoving = false;
    }

    //grab the canvas and context
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");

    //event listeners to move player
    canvas.addEventListener('mousedown', movePlayer);
    canvas.addEventListener('mouseup', stopPlayer);
    canvas.addEventListener('touchstart', movePlayer);
    canvas.addEventListener('touchend', stopPlayer);

    //update the logic
    var update = function() {

        //check if you've won the game
        if (checkCollision(player, goal)) {

            one = new Audio('./audio/what.mp3');
            one.play();

            alert('Win !');
            level += 1;
            life += 1;
            player.speedX += .25;
            player.x = 10;
            player.y = 260;
            player.isMoving = false;

            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].speedY > 1) {
                    enemies[i].speedY += .25;
                } else {
                    enemies[i].speedY -= .25;
                }
            }
        }

        //update player
        if (player.isMoving) {
            player.x = player.x + player.speedX;
        }

        //update enemies
        enemies.forEach(function(element) {

            //check for collision with player
            if (checkCollision(player, element)) {
                one = new Audio('./audio/oh_no.mp3');
                one.play();
                //stop the game
                if (life === 1) {
                    alert('Game Over');
                    one = new Audio('./audio/cartoon_sound.mp3');
                    one.play();

                    for (var i = 0; i < enemies.length; i++) {

                        if (enemies[i].speedY > 2) {
                            enemies[i].speedY = 3;
                        } else if (enemies[i].speedY == 2) {
                            enemies[i].speedY = 2;
                        } else {
                            enemies[i].speedY = -3;
                        }
                    }
                    level = 1;
                    life = 6;
                    player.speedX = 2;
                }

                if (life >= 0) {
                    life -= 1;
                }

                player.x = 10;
                player.y = 260;
                player.isMoving = false;
            }

            //move enemy
            element.y += element.speedY;

            //check borders
            if (element.y <= 10) {
                element.y = 10;
                //element.speedY = element.speedY * -1;
                element.speedY *= -1;
            } else if (element.y >= GAME_HEIGHT - 50) {
                element.y = GAME_HEIGHT - 50;
                //element.speedY=element.speedY*-1;
                element.speedY *= -1;
            }
        });
    };

    //show the game on the screen
    var draw = function() {
        //clear the canvas
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        //draw level
        ctx.font = "bold 15px Verdana";
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("Level : " + level, 10, 15);
        ctx.fillText("Life : " + life, 10, 35);
        ctx.fillText("Hero's Speed : " + player.speedX, 10, 55);

        //draw player 
        var img = document.getElementById("man");
        ctx.drawImage(img, player.x, player.y, player.w, player.h);


        //draw enemies
        ctx.fillStyle = "orangered";
        enemies.forEach(function(element) {
            ctx.fillRect(element.x, element.y, element.w, element.h);
        });

        //draw goal
        var img = document.getElementById("Land");
        ctx.drawImage(img, goal.x, goal.y, goal.w, goal.h);
    };

    //gets executed multiple times per second
    var step = function() {

        update();
        draw();

        if (gameLive) {
            window.requestAnimationFrame(step);
        }
    };

    //check the collision between two rectangles
    var checkCollision = function(rect1, rect2) {
        var closeOnWidth = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w)
        var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
        return closeOnWidth && closeOnHeight;
    }

    //initial kick
    step();
});