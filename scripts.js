/* 
FOOD SORTING GAME!

Objective of the player:
- Separate the good food items from the bad food items before the time runs out!
- The timer is the person's lifespan. Once the age is equal to the lifespan, the player wins!
- Careful not to collect the unhealthy foods, otherwise the lifespan will decrease by one.
- The main goal is to beat the previous high score!

Features:
- Timer that counts up towards a max time (Example: age / age limit)
- Random foods that fall from the sky
- Collect healthy foods to gain 2 coins and large amounts of energy
- Collect neutral foods to gain 1 coin and gain some energy
- Collect unhealthy foods to decrease lifespan and energy
- Foods increase in spawn the more you play
- Energy levels go down faster the more you age
- Enter to restart game
*/

// Canvas Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var city = new Image();
city.src = 'img/city.png';

// Timer Variables
var pAge = 0;
var pLifespan = 80;
var aTimer = 40; // timer for apple respawn
var bTimer = 40; // timer for burger respawn
var timerVar = document.getElementById("timers");

var init;
var birthday;

// Food Variables
var spriteS = 64;
var foods = [];

var foodSpawns;
var foodLimit = 1000;

var apple = new Image();
apple.addEventListener('load', startGame);
apple.src = 'img/apple.png';

// Box Variables
var bX = canvas.width / 2 - spriteS;
var bEnergy = 3;
var pBox = new Image();
pBox.src = 'img/Box.png';

// Key Pressed Handler to Nake Smooth Movement for Box
var mLeft = false;
var mRight = false;

document.onkeydown = function(e) {
    if(e.keyCode == 37) {
        mLeft = true;
    }
	if(e.keyCode == 39) {
        mRight = true;
    }
    if(e.keyCode == 13) {
        clearInterval(birthday);
        clearInterval(init);
        clearInterval(foodSpawns);
        startGame();
    }
}

document.onkeyup = function(e) {
    if(e.keyCode == 37) {
        mLeft = false;
    }
    if(e.keyCode == 39) {
        mRight = false;
    }
}

// Score Variables
var score = 0;
var highscore = 0;
var sVar = document.getElementById("score");
var hs = document.getElementById("highscore");

// Energy Variables
var bars = document.getElementById("bar");
var barCalc;

function startGame() {foods = [];
    score = 0;
    foodLimit = 1000;
    pAge = 0;
    pLifespan = 80;
    bEnergy = 3;

    init = setInterval(RandomFood, 0);
    birthday = setInterval(function(){
        // Age increase every second
        pAge++;
    
        // Energy Depletion
        if(bEnergy > 0.5) {
            var minusE = (pAge / pLifespan) / 1.5
            if(minusE > 0.25) {
                minusE = 0.25;
            }
            bEnergy -= minusE;
        }
    }, 1000);

    spawnFood();
}

function RandomFood() {
    // Background Refresh
    ctx.drawImage(city, 0, 0)

    // Timer & Score
    timerVar.innerHTML = "Lifespan: " + pAge + " / " + pLifespan;
    endGame();

    sVar.innerHTML = "Score: $" + score;
    hs.innerHTML = "High Score: $" + highscore;

    if(score > highscore) {
        highscore = score;
    }

    // Bottom Energy Bar
    eBar();
    
    // Box Handler
    theBox();
    ctx.drawImage(pBox, bX, canvas.height - spriteS)

    // Food Spawn
    if(foodLimit > 200) {
        foodLimit = pAge * -1900 / pLifespan + 2000;;
    } else {
        foodLimit = 200;
    }

    for(var i = 0; i < foods.length; i++) {
        var foodItem = foods[i];

        if(foodItem.y < canvas.height && !foodItem.eaten) {
            ctx.drawImage(apple, 64 * foodItem.idx, 64 * foodItem.idy, spriteS, spriteS, foodItem.x, foodItem.y, spriteS, spriteS);
        }

        // Score Handler
        if(foodItem.y >= canvas.height - 80 && foodItem.y < canvas.height - 50&& !foodItem.eaten) {
            if(foodItem.x < bX + 128 - 32 && foodItem.x > bX - 32) {
                foodItem.y = canvas.height;
                scoreSystem(foodItem);
                foodItem.eaten = true;
            }
        }
    }  
}

function endGame(){
    if(pAge >= pLifespan) {
        pAge = 0;
        clearInterval(birthday);
        clearInterval(init);
        clearInterval(foodSpawns);
    }
}

function spawnFood() {
    var rowCount = 0;
    var foodItem = {
        id: 0,
        idx: Math.floor(Math.random() * 8),
        idy: Math.floor(Math.random() * 8),
        x: Math.random() * (canvas.width - spriteS),
        y: -spriteS,
        eaten: false
    };

    // Food ID Assignment
    if(foodItem.idy > 0) {
        rowCount = 8 * foodItem.idy;
    }
    foodItem.id = (foodItem.idx + 1) + rowCount;

    // Move Handler
    setInterval(function() {foodItem.y += 1}, Math.floor(Math.random() * 20) + 1);

    foods.push(foodItem);
    foodSpawns = setTimeout(spawnFood, foodLimit);
}

function theBox() {
    if (mLeft && bX > 0) {
        bX -= bEnergy;
    } 
    else if (mRight && bX < canvas.width - 128) {
        bX += bEnergy;
    }

    // Energy
    if(bEnergy < 0.5) {
        bEnergy = 0.5; // to make sure the energy levels never go below 0.5
    }
    if(bEnergy > 3) {
        bEnergy = 3;
    }
}

function eBar() {
    var eWidth = document.getElementById("energy").clientWidth + 20; // width of energy bar plus margins
    var maxB = canvas.width - eWidth - 10; // The maximum width of the Bar
    
    /*
    Line directly below inspired from: 
    https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
    */

    barCalc = (bEnergy - 0.5) * (maxB - maxB / 10) / (3 - 0.5) + maxB / 10;
    
    /* 
    End of reference 
    */

    bars.style.width = barCalc.toString() + "px";

    if(barCalc / maxB < 0.3) {
        bars.style.backgroundColor = "red";
    } 
    else {
        bars.style.backgroundColor = "green";
    }
}

function scoreSystem(foodItem) {
    if(foodItem.id == 7 || foodItem.id == 8 || foodItem.id == 13
        || foodItem.id == 15 || foodItem.id == 16 || foodItem.id == 17 
        || foodItem.id == 19 || foodItem.id == 22 || foodItem.id == 24
        || foodItem.id == 25 || foodItem.id == 26 || foodItem.id == 27
        || foodItem.id == 28 || foodItem.id == 29 || foodItem.id == 30
        || foodItem.id == 33 || foodItem.id == 34 || foodItem.id == 35
        || foodItem.id == 36 || foodItem.id == 43 || foodItem.id == 44
        || foodItem.id == 46 || foodItem.id == 47 || foodItem.id == 48
        || foodItem.id == 49 || foodItem.id == 52 || foodItem.id == 55
        || foodItem.id == 57 || foodItem.id == 58 || foodItem.id == 64
    ) {
        bEnergy += 0.5;
        score += 2;
    } 
    else if ( foodItem.id == 3 || foodItem.id == 10 || foodItem.id == 11
        || foodItem.id == 12 || foodItem.id == 18 || foodItem.id == 40 
        || foodItem.id == 41 || foodItem.id == 45 || foodItem.id == 53
        || foodItem.id == 54 || foodItem.id == 60 || foodItem.id == 61
        || foodItem.id == 62 || foodItem.id == 63
    ) {
        bEnergy += 0.2;
        score++;
    } 
    else {
        pLifespan -= 2;
        bEnergy -= 0.2;
    }
}