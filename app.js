window.addEventListener("load", function() {
    //constants
    var width = 1080;
    var height = 580;

    //keep the game going
    var Live = true;

    //current level
    var level = 1;
    var life = 5;

    /* var enemies = [
            {
              x: 100, //x coordinate
              y: 100, //y coordinate
              speedY: 2, //speed in Y
              w: 40, //width
              h: 40 //heght
            },*/

    //attackers
    var attackers = [{
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

    //the player object which is placed at starting point
    var player = {
        x: 10,
        y: 260,
        speedX: 2,
        isback: false, //keep track of the player is moving-backward or not
        isForward: false, //keep track of the player is moving-forward or not
        w: 60,
        h: 60
    };

    /* //the goal object
     var goal = {
        x: 580,
        y: 160,
        w: 50,
        h: 36
      }; */

    //the ending point object where the player will be going
    var ending = {
        x: 980,
        y: 240,
        w: 90,
        h: 90
    }

    var Forward = function() {
        one = new Audio('./audio/foot.mp3');
        one.play();
        player.isForward = true;
    };

    var stopMoving = function() {
        player.isForward = false;
    }


    //adding keyboard events
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function keyDown(e) {
        if ((e.keyCode == 68) || (e.keyCode == 39)) {
            one = new Audio('./audio/foot.mp3');
            one.play();
            player.isForward = true;
        } else {
            player.isForward = false;
            player.isback = false;
        }
    }

    function keyUp(e) {
        if (e.keyCode == 65) {
            one = new Audio('./audio/foot.mp3');
            one.play();
            player.isback = true;
        } else {
            player.isForward = false;
            player.isback = false;
        }

    }

    //grab the canvas and context
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");

    //event listeners to move player
    canvas.addEventListener('mousedown', Forward);
    canvas.addEventListener('mouseup', stopMoving);
    canvas.addEventListener('touchstart', Forward);
    canvas.addEventListener('touchend', stopMoving);

    //update the logic
    var update = function() {

        /* level = level + 1;
            player.x = 10;
            document.title = "Level: " + level;
            for ( var i = 0; i < enemies_length; i++ ) {
                if ( enemies[i].speedY > 0 ) {
                    enemies[i].speedY += 1;
                } else {
                    enemies[i].speedY -= 1;
                }
            }
        }*/

        //check if you've won the game
        if (Collision(player, ending)) {

            one = new Audio('./audio/what.mp3');
            one.play();
            swal('Yo.. you have won !', "Keep Going ", "./Images/up1.png", { button: "Aww yiss!" });
            level += 1;
            life += 1;
            player.speedX += .25;
            player.x = 10;
            player.y = 260;
            player.isForward = false;
            player.isback = false;

            for (var i = 0; i < attackers.length; i++) {
                if (attackers[i].speedY > 1) {
                    attackers[i].speedY += .25;
                } else {
                    attackers[i].speedY -= .25;
                }
            }
        }


        /* //update player
        if(player.isMoving) {
           player.x = player.x + player.speedX;
         }*/

        //update player
        if (player.isForward) {
            player.x = player.x + player.speedX;
        } else if (player.isback) {
            player.x = player.x - player.speedX;
        }

        //update attackers
        attackers.forEach(function(enemy) {

            //check for collision with player
            if (Collision(player, enemy)) {
                one = new Audio('./audio/oh_no.mp3');
                one.play();
                //stop the game
                if (life === 1) {
                    swal('Game Over !', "game starts from begining", "./Images/game.jpg");
                    one = new Audio('./audio/cartoon_sound.mp3');
                    one.play();

                    for (var i = 0; i < enemy.length; i++) {

                        if (enemy[i].speedY > 2) {
                            enemy[i].speedY = 3;
                        } else if (enemy[i].speedY == 2) {
                            enemy[i].speedY = 2;
                        } else {
                            enemy[i].speedY = -3;
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
                player.isForward = false;
                player.isback = false;
            }

            //move enemy
            enemy.y += enemy.speedY;

            //check borders
            if (enemy.y <= 10) {
                enemy.y = 10;
                //enemy.speedY = enemy.speedY * -1;
                enemy.speedY *= -1;
            } else if (enemy.y >= height - 50) {
                enemy.y = height - 50;
                //enemy.speedY=enemy.speedY*-1;
                enemy.speedY *= -1;
            }
        });
    };

    //show the game on the screen
    var draw = function() {
        //clear the canvas
        ctx.clearRect(0, 0, width, height);
        //draw level
        ctx.font = "bold 15px Verdana";
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("Level : " + level, 10, 15); //to show this level on top left using width and height
        ctx.fillText("Life : " + life, 10, 35); //to show this life on top left which is below level using width and height
        ctx.fillText("Hero's Speed : " + player.speedX, 10, 55); // to show this hero's Speed which is below life using width and height

        //draw player
        var img = new Image();
        img.src = './Images/soldier1.png';
        //var img = document.getElementById("man");
        ctx.drawImage(img, player.x, player.y, player.w, player.h);


        //draw attackers
        //ctx.fillStyle = "orangered";
        var img = new Image();
        img.src = './Images/devil.png';
        //img.src = './Images/3.png';
        attackers.forEach(function(enemy) {
            ctx.drawImage(img, enemy.x, enemy.y, enemy.w, enemy.h);
        });

        //draw ending point
        //ctx.fillstyle="Green"
        var img = new Image();
        img.src = './Images/base1.png';
        //var img = document.getElementById("Land");
        ctx.drawImage(img, ending.x, ending.y, ending.w, ending.h);
    };

    //gets executed multiple times per second
    var move = function() {

        update();
        draw();

        if (Live) {
            window.requestAnimationFrame(move);
        }
    };

    /*  var checkCollision = function(rect1, rect2) {

        var closeOnWidth = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
        var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
        return closeOnWidth && closeOnHeight;
      };*/

    //check the collision between two rectangles
    var Collision = function(rect1, rect2) {
        var closeW = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
        //where player 'x' and attacker 'x' co-ordinates are checked whether they are colliding each other or no with respect to the player width and attacker width.
        var closeH = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
        //where player 'y' and attacker 'y' co-ordinates are checked whether they are colliding each other or no with respect to the player height and attacker height.
        return closeW && closeH;
    }

    //initial move
    move();
});