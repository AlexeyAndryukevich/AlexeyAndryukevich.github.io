angular.module('ngSnake', ['ngMaterial'])

.controller('snakeCtrl', function ($scope, $timeout, $window, $mdDialog) {

  $scope.GameOverPopUp = function() { 
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('GAME OVER')
        .textContent(checkBestScore($scope.currentScore))
        .ok('OK')         
    ).then(function() {
      gameOver();
    });
  };     

  checkBestScore = function(score) {
    if ($scope.currentScore > $scope.bestScore) {
      $scope.bestScore = $scope.currentScore;
      window.localStorage["bestScore"] = JSON.stringify($scope.bestScore);
      return "Congrats! You've set a new best score: " + $scope.bestScore + "!";
    } else if ($scope.bestScore - $scope.currentScore <= 5) {
      return "Nice try! You are so close to set new best score. " + "You lack " + ($scope.bestScore - $scope.currentScore + 1) + " points. Try again!";
    } else {
      return "Your score is " + $scope.currentScore;
    }
  }  

  var GAME = {
    STOP: 0,
    ACTION: 1,
    PAUSE: 2
  }
  var GAME_STATE = GAME.STOP;

  var CHAIRS_ARR = [
    {CHAIR_DX:  2, CHAIR_X:  8, CHAIR_DY: 10, CHAIR_Y: 32},
    {CHAIR_DX: 14, CHAIR_X: 14, CHAIR_DY: 12, CHAIR_Y: 18-2},
    {CHAIR_DX: 14, CHAIR_X: 14, CHAIR_DY: 34, CHAIR_Y: 11-3},
    {CHAIR_DX: 32, CHAIR_X:  8, CHAIR_DY: 10, CHAIR_Y: 18},
    {CHAIR_DX: 32, CHAIR_X:  8, CHAIR_DY: 31, CHAIR_Y: 11}          
  ];
  var STAGE_ARR = [
    {CHAIR_DX: 10, CHAIR_X: 22, CHAIR_DY: 0, CHAIR_Y: 1},
    {CHAIR_DX: 11, CHAIR_X: 20, CHAIR_DY: 1, CHAIR_Y: 1},
    {CHAIR_DX: 12, CHAIR_X: 18, CHAIR_DY: 2, CHAIR_Y: 1},
    {CHAIR_DX: 13, CHAIR_X: 16, CHAIR_DY: 3, CHAIR_Y: 1} 
  ];    
  var BOARD_SIZE_X = 42, BOARD_SIZE_Y = 44;

  $scope.resize = function (){
    $scope.hgt = ($window.innerHeight - 115) / BOARD_SIZE_Y;
    if ($scope.hgt * BOARD_SIZE_X > $window.innerWidth -20) {
      $scope.hgt = ($window.innerWidth - 20) / BOARD_SIZE_X;
    }
  }	
  $scope.resize();    
  angular.element($window).on('resize', function() {
    $scope.$apply($scope.resize);
  });

  var DIRECTIONS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };

  var COLORS = {
    GAME_OVER: '#820303',
    FRUIT: '#f69c51',      
    SNAKE_BODY: '#0ece2e',
    BOARD: '#494D51',
    CHAIR: '#1474d4',
    EMPTY_CHAIR: "#4fa7ff",
    STAGE: '#909090'
  };

  var snake = {
    direction: DIRECTIONS.RIGHT,
    parts: [{
      x: -1,
      y: -1
    }]
  };
  
  var fruits = [];
  var NUM_OF_FRUITS = 10;
  for (var i=0; i<NUM_OF_FRUITS; i++) {
    fruits.push({x:-1, y:-1});
  }

  var interval, tempDirection, isGameOver, timer, myBoard;

  $scope.buttonText = "Start Game";
  $scope.currentScore = 0;
  if (window.localStorage["bestScore"] === undefined)
    window.localStorage["bestScore"] = JSON.stringify(0);
  $scope.bestScore = JSON.parse(window.localStorage["bestScore"]);

  console.log(window.localStorage["bestScore"]);

/*
  var temp = JSON.parse(window.localStorage["bestScore"])
  window.localStorage["bestScore"] = JSON.stringify(_data, val);
*/





  $scope.setStyling = function(col, row) {
    if (isGameOver)  {
      return COLORS.GAME_OVER;
    } else if ($scope.board[col][row] === "snake") {
      return COLORS.SNAKE_BODY;
    } else if ($scope.board[col][row] === "chair") {
      return COLORS.CHAIR;
    } else if ($scope.board[col][row] === "emptyChair") {
      return COLORS.EMPTY_CHAIR;
    } else if ($scope.board[col][row] === "fruit") {
      return COLORS.FRUIT;
    } else if ($scope.board[col][row] === "stage") {
      return COLORS.STAGE;
    }
    return COLORS.BOARD;
  };

  function update() {
    var newHead = getNewHead();

    if (boardCollision(newHead) || chairCollision(newHead) || stageCollision(newHead) || selfCollision(newHead)) {      
      return $scope.GameOverPopUp();
    } else if (fruitCollision(newHead)) {
      eatFruit(newHead);
    }

    // Remove tail
    var oldTail = snake.parts.pop();
    $scope.board[oldTail.y][oldTail.x] = "board";

    // Pop tail to head
    snake.parts.unshift(newHead);
    $scope.board[newHead.y][newHead.x] = "snake";

    // Do it again
    snake.direction = tempDirection;
    timer = $timeout(update, interval);
  }

  function getNewHead() {
    var newHead = angular.copy(snake.parts[0]);

    // Update Location
    if (tempDirection === DIRECTIONS.LEFT) {
        newHead.x -= 1;
    } else if (tempDirection === DIRECTIONS.RIGHT) {
        newHead.x += 1;
    } else if (tempDirection === DIRECTIONS.UP) {
        newHead.y -= 1;
    } else if (tempDirection === DIRECTIONS.DOWN) {
        newHead.y += 1;
    }
    return newHead;
  }

  function boardCollision(part) {
    return part.x === BOARD_SIZE_X || part.x === -1 || part.y === BOARD_SIZE_Y || part.y === -1;
  }

  function chairCollision(part) {     
    return $scope.board[part.y][part.x] === "chair" || $scope.board[part.y][part.x] === "emptyChair";      
  }

  function stageCollision(part) {
    return $scope.board[part.y][part.x] === "stage";
  }

  function selfCollision(part) {
    return $scope.board[part.y][part.x] === "snake";
  }

  function fruitCollision(part) {
    return $scope.board[part.y][part.x] === "fruit";
  }


  function resetNumFruit(fruit) {
    var x = Math.floor(Math.random() * BOARD_SIZE_X);
    var y = Math.floor(Math.random() * BOARD_SIZE_Y);
    if ($scope.board[y][x] === "snake" || $scope.board[y][x] === "chair" || $scope.board[y][x] === "emptyChair" || $scope.board[y][x] === "stage" || $scope.board[y][x] === "fruit") {
      return resetNumFruit(fruit);
    }
    fruit.x = x;
    fruit.y = y;
    $scope.board[y][x] = "fruit";
  }

  function resetChair() {
    var i = Math.floor(Math.random() * CHAIRS_ARR.length);
    var x = Math.floor(Math.random() * CHAIRS_ARR[i].CHAIR_X);
    var y = Math.floor(Math.random() * CHAIRS_ARR[i].CHAIR_Y);
    if ($scope.board[CHAIRS_ARR[i].CHAIR_DY + y][CHAIRS_ARR[i].CHAIR_DX + x] === "emptyChair") {
      return resetChair();
    }
    $scope.board[CHAIRS_ARR[i].CHAIR_DY + y][CHAIRS_ARR[i].CHAIR_DX + x] = "emptyChair";
  }

  function eatFruit(part) {
    $scope.currentScore++;  

    var tail = angular.copy(snake.parts[snake.parts.length-1]);
    snake.parts.push(tail);

    for (var i=0;i<fruits.length;i++) {
      if (part.x === fruits[i].x && part.y === fruits[i].y) {
        resetNumFruit(fruits[i]);
        break;
      }
    }

    resetChair();

    if ($scope.currentScore % 10 === 0) {
      //interval -= 5; 
    }
  }

  function gameOver() {
    GAME_STATE = GAME.STOP;            
    isGameOver = true;
    $scope.currentScore = 0;


    $timeout(function() {
      isGameOver = false;
    },500);
    setupBoard();
    setupField(CHAIRS_ARR, "chair");
    setupField(STAGE_ARR, "stage");
    $scope.buttonText = "Start game";      
  }

  function setupBoard() { 
    $scope.board = [];
    for (var i = 0; i < BOARD_SIZE_Y; i++) {
      $scope.board[i] = [];
      for (var j = 0; j < BOARD_SIZE_X; j++) {
        $scope.board[i][j] = "board";
      }
    }
  }
  setupBoard();   

  function setupField(arr, field) {  
    for (var k=0;k<arr.length;k++) {
      for (var i = 0; i < arr[k].CHAIR_Y; i++) {
        for (var j = 0; j < arr[k].CHAIR_X; j++) {
          $scope.board[arr[k].CHAIR_DY+i][arr[k].CHAIR_DX+j] = field;
        }
      }
    }     
  }
  setupField(CHAIRS_ARR, "chair");
  setupField(STAGE_ARR, "stage");

  var changeDirection = function(e) { 
    if (e.keyCode == DIRECTIONS.LEFT && snake.direction !== DIRECTIONS.RIGHT) {
      tempDirection = DIRECTIONS.LEFT;
    } else if (e.keyCode == DIRECTIONS.UP && snake.direction !== DIRECTIONS.DOWN) {
      tempDirection = DIRECTIONS.UP;
    } else if (e.keyCode == DIRECTIONS.RIGHT && snake.direction !== DIRECTIONS.LEFT) {
      tempDirection = DIRECTIONS.RIGHT;
    } else if (e.keyCode == DIRECTIONS.DOWN && snake.direction !== DIRECTIONS.UP) {
      tempDirection = DIRECTIONS.DOWN;
    }
  };

  function touchCatched(e) {
    touch = e;
  }

  function touchEnded(e) {
    e.preventDefault();
    var offsetX = touch.changedTouches[0].clientX - e.changedTouches[0].clientX;
    var offsetY = touch.changedTouches[0].clientY - e.changedTouches[0].clientY;

    console.log(offsetX, offsetY);

    var rule = new Object();

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      if (offsetX < 0) {
        rule.keyCode = 39;
      } else {
        rule.keyCode = 37;
      }
    } else {
      if (offsetY < 0) {
        rule.keyCode = 40;
      } else {
        rule.keyCode = 38;
      }
    }
    changeDirection(rule);
  }      
  $window.addEventListener("keydown", changeDirection, false);
  $window.addEventListener("touchstart", touchCatched, false);
  $window.addEventListener("touchmove", touchEnded, false);

  $scope.buttonClick = function() {
    if(GAME_STATE === GAME.STOP)
      $scope.startGame();
    else if (GAME_STATE === GAME.PAUSE)
      $scope.continueGame();
    else if (GAME_STATE === GAME.ACTION)
      $scope.pauseGame();
  }

  $scope.continueGame = function() {
    $scope.buttonText = "Pause";
    GAME_STATE = GAME.ACTION;
      $scope.board = JSON.parse(myBoard);
      timer = $timeout(update, interval);
  }

  $scope.pauseGame = function() {
    $scope.buttonText = "Continue";
    $timeout.cancel(timer);
    GAME_STATE = GAME.PAUSE;
    myBoard = JSON.stringify($scope.board);    
  }

  $scope.startGame = function() {      
    GAME_STATE = GAME.ACTION;      
    $scope.buttonText = "Pause";
    $scope.currentScore = 0;
    snake = {direction: DIRECTIONS.RIGHT, parts: []};
    tempDirection = DIRECTIONS.RIGHT;
    isGameOver = false;
    interval = 200;

    // Set up initial snake
    for (var i = 0; i < 5; i++) {
      snake.parts.push({x: 2 - i, y: 4});
    }

    for (var i=0; i<fruits.length;i++) {
      resetNumFruit(fruits[i]);
      resetChair();        
    }      
    update();
  };
});