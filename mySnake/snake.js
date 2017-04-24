
angular.module('ngSnake', [])

  .controller('snakeCtrl', function ($scope, $timeout, $window) {

  
  var BOARD_SIZE_X = 40, BOARD_SIZE_Y = 50;

  var CHAIR_DX=10, CHAIR_X=20, CHAIR_DY=20, CHAIR_Y = 20;

  var NUM_OF_FRUITS = 5;
	
  /*
    - сделать области: стулья и т.д.
    - сделать через DOM - ускорить
    - поработать со стилями чтоб Material Desining или похожее 
  */
	

      
	/*     
		���������� ��� ������ ������� � ������
		��������� �������...
	*/


	
  $scope.hgt = ($window.innerHeight - 80) / BOARD_SIZE_Y;

  if ($scope.hgt * BOARD_SIZE_X > $window.innerWidth - 20) {
      $scope.hgt = ($window.innerWidth - 20) / BOARD_SIZE_X;
  }

	
	$scope.resize = function (){
	    $scope.hgt = ($window.innerHeight - 80) / BOARD_SIZE_Y;

	    if ($scope.hgt * BOARD_SIZE_X > $window.innerWidth -20) {
	        $scope.hgt = ($window.innerWidth - 20) / BOARD_SIZE_X;
	    }
	}
	
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
      EMPTY_CHAIR: "#4fa7ff"
    };

    var snake = {
      direction: DIRECTIONS.LEFT,
      parts: [{
        x: -1,
        y: -1
      }]
    };


    
    var fruits = [];
    for (var i=0; i<NUM_OF_FRUITS; i++) {
      fruits.push({x:-1, y:-1});
    }

    var interval, tempDirection, isGameOver;

    $scope.score = 0;

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
      }
      return COLORS.BOARD;
    };

    function update() {
      var newHead = getNewHead();

      if (boardCollision(newHead) || chairCollision(newHead) || selfCollision(newHead)) {
        return gameOver();
      } else if ($scope.score === CHAIR_X*CHAIR_Y) {
        return wellDone();
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
      $timeout(update, interval);
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
      if (part.x === CHAIR_DX || part.x === CHAIR_DX+CHAIR_X-1)
        return (part.y > CHAIR_DY && part.y < CHAIR_DY + CHAIR_Y);
      else if (part.y === CHAIR_DY  || part.y === CHAIR_DY+CHAIR_Y-1)
        return (part.x > CHAIR_DX && part.x < CHAIR_DX + CHAIR_X);
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

      if ($scope.board[y][x] === "snake" || $scope.board[y][x] === "chair" || $scope.board[y][x] === "emptyChair" || $scope.board[y][x] === "fruit") {
        return resetNumFruit(fruit);
      }
      fruit.x= x;
      fruit.y= y;
      $scope.board[y][x] = "fruit";
    }


    function resetChair() {
      var x = Math.floor(Math.random() * CHAIR_X);
      var y = Math.floor(Math.random() * CHAIR_Y);

      if ($scope.board[CHAIR_DY + y][CHAIR_DX + x] === "emptyChair") {
        return resetChair();
      }

      $scope.board[CHAIR_DY + y][CHAIR_DX + x] = "emptyChair";

    }

    function eatFruit(part) {
      $scope.score++;
      
      // Grow by 1
      var tail = angular.copy(snake.parts[snake.parts.length-1]);
      snake.parts.push(tail);

      for (var i=0;i<fruits.length;i++) {
        if (part.x === fruits[i].x && part.y === fruits[i].y) {
          resetNumFruit(fruits[i]);
          break;
        }
      }

      resetChair();

      if ($scope.score % 5 === 0) {
        interval -= 15;
      }
    }

    function gameOver() {

      isGameOver = true;
      alert("GAME OVER! Yours score is "+$scope.score+"!");

      $timeout(function() {
        isGameOver = false;
      },500);

      setupBoard();
      setupChairs(CHAIR_DX,CHAIR_X,CHAIR_DY,CHAIR_Y);
    }


    function wellDone() {
      isGameOver = true;
      alert("WELL DONE!");

      $timeout(function() {
        isGameOver = false;
      },500);

      setupBoard();
      setupChairs(CHAIR_DX,CHAIR_X,CHAIR_DY,CHAIR_Y);
    }


    function setupBoard() {  // ����� �������� ������� � ���� ������, � ����� ����� window ������� �=������ DOM ���������...
      $scope.board = [];
      for (var i = 0; i < BOARD_SIZE_Y; i++) {
        $scope.board[i] = [];
        for (var j = 0; j < BOARD_SIZE_X; j++) {
          $scope.board[i][j] = "board";
        }
      }
    }
    setupBoard();

    function setupChairs(dx,x,dy,y) {  // ����� �������� ������� � ���� ������, � ����� ����� window ������� �=������ DOM ���������...
      console.log(dx, dy);
      for (var i = 0; i < y; i++) {
        for (var j = 0; j < x; j++) {
          $scope.board[dy+j][dx+i] = "chair";
        }
      }
    }
    setupChairs(CHAIR_DX,CHAIR_X,CHAIR_DY,CHAIR_Y);

    var changeDirection = function(e) { // ���� keyup � ��� ���������� � ����������
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


    $scope.startGame = function() {
      $scope.score = 0;
      snake = {direction: DIRECTIONS.LEFT, parts: []};
      tempDirection = DIRECTIONS.LEFT;
      isGameOver = false;
      interval = 150;

      // Set up initial snake
      for (var i = 0; i < 5; i++) {
        snake.parts.push({x: 10 + i, y: 10});
      }

      for (var i=0; i<fruits.length;i++) {
        resetNumFruit(fruits[i]);
        resetChair();        
      }      
      update();
    };

  });