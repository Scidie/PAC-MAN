let startGame = true;
let moveCounter = 0;
let openMouth = true;
let ghostGotPacman = false;
let lastValue;
let score = 10;
let lostDirection = '';
let ghostAxisDirection = 'x';
let fourMovesDone = 0;
let xAxisBLocked = false;
let yAxisBlocked = false;
let ghostLost = false;
let currentAxis = 'y';
let goAround = false;
let directionToGo = '';
let ghostChangedPosition = false;
let direction = 's';
let goToVerifyDirection = false;
const scoreBoard = document.getElementById('scoreBoard');
const scoreValue = document.getElementById('scoreValue');
const gameBoardContainer = document.getElementById('gameBoardConatainer');
const mainContainer = document.getElementById('mainContainer');
const gameOverScreen = document.createElement('div');
const boardToRender = [
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,4],
    [4,3,1,3,3,3,3,3,1,3,3,3,3,3,1,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,3,1,3,4,4,4,3,1,3,4,4,4,3,1,3,4,4,4,4,4,4,4,4,4,4,4], 
    [4,3,1,3,3,3,3,3,1,3,3,3,3,3,1,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,4],
    [4,3,1,3,3,3,3,3,1,3,3,3,1,3,3,3,1,3,3,3,3,3,3,3,1,3,4],
    [4,3,1,3,4,4,4,3,1,3,4,3,1,3,4,3,1,3,4,4,4,4,4,3,1,3,4],
    [4,3,1,3,3,3,3,3,1,3,4,3,1,3,4,3,1,3,3,3,3,3,3,3,1,3,4],
    [4,3,1,1,1,1,1,1,1,3,4,3,1,3,4,3,1,1,1,1,1,1,1,1,1,3,4],
    [4,3,3,3,3,3,3,3,1,3,4,3,1,3,4,3,1,3,3,3,3,3,3,3,1,3,4],
    [4,4,4,4,4,4,4,3,1,3,4,3,1,3,4,3,1,3,4,4,4,4,4,3,1,3,4],
    [4,3,3,3,3,3,3,3,1,3,3,3,1,3,3,3,1,3,3,3,3,3,3,3,1,3,4],
    [4,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,4],
    [4,3,3,3,3,3,3,3,1,3,3,3,1,3,3,3,1,3,3,3,3,3,3,3,1,3,4],
    [4,4,4,4,4,4,4,3,1,3,4,3,1,3,4,3,1,3,4,4,4,4,4,3,1,3,4],
    [4,3,3,3,3,3,3,3,1,3,4,3,1,3,4,3,1,3,3,3,3,3,3,3,1,3,4],
    [4,3,1,1,1,1,1,1,1,3,4,3,1,3,4,3,1,1,1,1,1,1,1,1,1,3,4],
    [4,3,3,3,3,3,3,3,3,3,4,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];
const pacManPosition = {x: 17, y: 15}
const ghostPosition = {x: 1, y: 10}
const pacMan = document.createElement('div');
pacMan.classList.add('pacMan');
gameOverScreen.classList.add('gameOverScreen');

window.addEventListener('keypress', function(event) {
    if (event.key === 'w' && boardToRender[pacManPosition.x - 1][pacManPosition.y] !== 3 ||
        event.key === 's' && boardToRender[pacManPosition.x + 1][pacManPosition.y] !== 3 || 
        event.key === 'a' && boardToRender[pacManPosition.x][pacManPosition.y - 1] !== 3 || 
        event.key === 'd' && boardToRender[pacManPosition.x][pacManPosition.y + 1] !== 3)  {
        direction = event.key;
    }
});

function checkMaxScore() {
    scoreCounter = 0;
    boardToRender.forEach(element => {
        element.forEach(element => {
            if (element === 1) {
                scoreCounter = scoreCounter + 10;
            }
        })
    })
    return scoreCounter;
}

let maxScore = checkMaxScore();

function gameOver() {
    gameBoardContainer.appendChild(gameOverScreen);
    gameOverScreen.innerHTML = 'GAME OVER';
}

function Winner() {
    gameBoardContainer.appendChild(gameOverScreen);
    gameOverScreen.style.color = 'yellow';
    gameOverScreen.innerHTML = 'VICTORY!';
}
function renderBoard() {
    const gameBoard = document.createElement('div');
    gameBoard.classList.add('gameBoard');
    gameBoardContainer.appendChild(gameBoard);
    boardToRender.forEach(element => {
        const row = document.createElement('div');
        row.classList.add('row');
        gameBoard.appendChild(row);
        element.forEach(element => {
            if (element === 1) {
                const empty = document.createElement('div');
                empty.classList.add('empty');
                row.appendChild(empty);
            } else if (element === 2) {
                pacMan.classList.add('pacMan');
                row.appendChild(pacMan);
            } else if (element === 3) {
                const invisibleWall = document.createElement('div');
                invisibleWall.classList.add('invisibleWall');
                row.appendChild(invisibleWall);
            } else if (element === 4) {
                const visibleWall = document.createElement('div');
                visibleWall.classList.add('visibleWall');
                row.appendChild(visibleWall);
            } else if (element === 5) {
                const ghost = document.createElement('div');
                ghost.classList.add('ghost');
                row.appendChild(ghost);
            } else if (element === 6) {
                const emptyEmpty = document.createElement('div');
                emptyEmpty.classList.add('empty-empty');
                row.appendChild(emptyEmpty);
            }
        });
    });
}

let openMouthCounter = 0;

function movePacMan() {
        if (direction === 'w' && boardToRender[pacManPosition.x - 1][pacManPosition.y] !== 3) {
            boardToRender[pacManPosition.x][pacManPosition.y] = 6;
            pacManPosition.x = pacManPosition.x - 1;
            if (ghostGotPacman === false) {
                if (openMouth === true) {
                    pacMan.style.backgroundImage = "url('images/closedMouth.png')"
                    openMouthCounter++;
                    if (openMouthCounter === 2) {
                        openMouthCounter = 0;
                        openMouth = false;
                    }
                    
                } else {
                    pacMan.style.backgroundImage = "url('images/openedMouthUp.png')"
                    openMouth = true;
                }
            }
            if (boardToRender[pacManPosition.x][pacManPosition.y] === 1) {
                score = score + 10;
                scoreValue.innerHTML = score;
            }
        } else if (direction === 's' && boardToRender[pacManPosition.x + 1][pacManPosition.y] !== 3) {
            boardToRender[pacManPosition.x][pacManPosition.y] = 6;
            pacManPosition.x = pacManPosition.x + 1;
            if (ghostGotPacman === false) {
                if (openMouth === true) {
                    pacMan.style.backgroundImage = "url('images/closedMouth.png')"
                    openMouthCounter++;
                    if (openMouthCounter === 2) {
                        openMouthCounter = 0;
                        openMouth = false;
                    }
                } else {
                    pacMan.style.backgroundImage = "url('images/openedMouthDown.png')"
                    openMouth = true;
                }
            }
            if (boardToRender[pacManPosition.x][pacManPosition.y] === 1) {
                score = score + 10;
                scoreValue.innerHTML = score;
            }
        } else if (direction === 'a' && boardToRender[pacManPosition.x][pacManPosition.y - 1] !== 3) {
            boardToRender[pacManPosition.x][pacManPosition.y] = 6;
            pacManPosition.y = pacManPosition.y - 1;
            if (ghostGotPacman === false) {
                if (openMouth === true) {
                    pacMan.style.backgroundImage = "url('images/closedMouth.png')"
                    openMouthCounter++;
                    if (openMouthCounter === 2) {
                        openMouthCounter = 0;
                        openMouth = false;
                    }
                } else {
                    pacMan.style.backgroundImage = "url('images/openedMouthLeft.png')"
                    openMouth = true;
                }
            }
            if (boardToRender[pacManPosition.x][pacManPosition.y] === 1) {
                score = score + 10;
                scoreValue.innerHTML = score;
            }
        } else if (direction === 'd' && boardToRender[pacManPosition.x][pacManPosition.y + 1] !== 3) {
            boardToRender[pacManPosition.x][pacManPosition.y] = 6;
            pacManPosition.y = pacManPosition.y + 1;
            if (ghostGotPacman === false) {
                if (openMouth === true) {
                    pacMan.style.backgroundImage = "url('images/closedMouth.png')"
                    openMouthCounter++;
                    if (openMouthCounter === 2) {
                        openMouthCounter = 0;
                        openMouth = false;
                    }
                } else {
                    pacMan.style.backgroundImage = "url('images/openedMouthRight.png')"
                    openMouth = true;
                }
            }
            if (boardToRender[pacManPosition.x][pacManPosition.y] === 1) {
                score = score + 10;
                scoreValue.innerHTML = score;
            }
        }
}

function setPacManOnBoard() {
    boardToRender[pacManPosition.x][pacManPosition.y] = 2;
}

function moveGhost() {
    if (ghostPosition.x === pacManPosition.x && ghostPosition.y === pacManPosition.y) {
        ghostGotPacman = true;
    } else {
        ghostGotPacman = false;
    }
    while (ghostChangedPosition === false && ghostGotPacman === false) {
        if (xAxisBLocked === true && yAxisBlocked === true) {
            ghostLost = true;
        } 
        if (fourMovesDone === 4) {
            fourMovesDone = 0;
            ghostLost = false;
        }
        if (ghostLost === true && fourMovesDone < 4) {
            if (lostDirection === '') {
                if (ghostAxisDirection === 'x') {
                    if (ghostAxisDirection === 'x' && boardToRender[ghostPosition.x + 1][ghostPosition.y] !== 3) {
                        lostDirection = 'down';
                    } else if (ghostAxisDirection === 'x' && boardToRender[ghostPosition.x - 1][ghostPosition.y] !== 3) {
                        lostDirection = 'up';
                    }
                } else if (ghostAxisDirection === 'y') {
                    if (ghostAxisDirection === 'y' && boardToRender[ghostPosition.x][ghostPosition.y + 1] !== 3) {
                        lostDirection = 'right';
                    } else if (ghostAxisDirection === 'y' && boardToRender[ghostPosition.x][ghostPosition.y - 1] !== 3) {
                        lostDirection = 'left';
                    }
                }    
            }
            
            if (lostDirection === 'down') {
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                }
                if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.x = ghostPosition.x + 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (boardToRender[ghostPosition.x][ghostPosition.y + 1] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'y'
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x][ghostPosition.y - 1] !== 3) {
                    lostDirection = 'up';
                }
            } else if (lostDirection === 'up') {
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } 
                if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.x = ghostPosition.x - 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (boardToRender[ghostPosition.x][ghostPosition.y + 1] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'y';
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x][ghostPosition.y - 1] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'y'
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x + 1][ghostPosition.y] === 3) {
                    lostDirection = 'down';
                }
            } else if (lostDirection === 'right') { //-----------------------------------------------------------------------------------
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } else if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.y = ghostPosition.y + 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (boardToRender[ghostPosition.x + 1][ghostPosition.y] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'x';
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x - 1][ghostPosition.y] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'x'
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x][ghostPosition.y + 1] === 3) {
                    lostDirection = 'left';
                }
            } else if (lostDirection === 'left') { //----------------------------------------------------------------------------------
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } else if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.y = ghostPosition.y - 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (boardToRender[ghostPosition.x + 1][ghostPosition.y] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'x';
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x - 1][ghostPosition.y] !== 3) {
                    fourMovesDone++;
                    ghostAxisDirection = 'x'
                    lostDirection = '';
                } else if (boardToRender[ghostPosition.x][ghostPosition.y - 1] === 3) {
                    lostDirection = 'right';
                }
            } 
        } else if (currentAxis === 'x' && goAround === false && goToVerifyDirection === false) {
                if (ghostPosition.x !== pacManPosition.x) {
                    if (ghostPosition.x < pacManPosition.x && boardToRender[ghostPosition.x + 1][ghostPosition.y] !== 3) {
                        yAxisBlocked = false;
                        if (lastValue === undefined) {
                            lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                        } else if (lastValue === 2) {
                            boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                        } else {
                            boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                        }
                        ghostPosition.x = ghostPosition.x + 1;
                        lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                        ghostChangedPosition = true;
                    } else if (ghostPosition.x > pacManPosition.x && boardToRender[ghostPosition.x - 1][ghostPosition.y] !== 3) {
                        yAxisBlocked = false;
                        if (lastValue === 2) {
                            boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                        } else if (lastValue !== undefined) {
                            boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                        }
                        ghostPosition.x = ghostPosition.x - 1;
                        lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                        ghostChangedPosition = true;
                    } else {
                        currentAxis = 'y';
                        xAxisBLocked = true;
                    }
                } else if (ghostPosition.x === pacManPosition.x) {
                    if (ghostPosition.y > pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y - 1] === 3 || 
                        ghostPosition.y < pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y + 1] === 3) {
                        goToVerifyDirection = true;
                    } else {
                        currentAxis = 'y';
                    }
                } 
        } else if (currentAxis === 'y' && goAround === false && goToVerifyDirection === false) {
            if (ghostPosition.y !== pacManPosition.y) {
                if (ghostPosition.y < pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y + 1] !== 3) {
                    xAxisBLocked = false;
                    if (lastValue === undefined) {
                        lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                    } else if (lastValue === 2) {
                        boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                    } else {
                        boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                    }
                    ghostPosition.y = ghostPosition.y + 1;
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                    ghostChangedPosition = true;
                } else if (ghostPosition.y > pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y - 1] !== 3) {
                    xAxisBLocked = false;
                    if (lastValue === undefined) {
                        lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                    } else if (lastValue === 2) {
                        boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                    } else {
                        boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                    }
                    ghostPosition.y = ghostPosition.y - 1;
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                    ghostChangedPosition = true;
                } else {
                    currentAxis = 'x';
                    yAxisBlocked = true;
                }
            } else if (ghostPosition.y === pacManPosition.y) {
                if (ghostPosition.x < pacManPosition.x && boardToRender[ghostPosition.x + 1][ghostPosition.y] === 3 ||
                    ghostPosition.x > pacManPosition.x && boardToRender[ghostPosition.x - 1][ghostPosition.y] === 3) {
                    goToVerifyDirection = true;
                } else {
                    currentAxis = 'x';
                }            
            }
        } else if (goToVerifyDirection === true) {
            xAxisBLocked = false;
            yAxisBlocked = false;
            upPolesCounter = 0;
            downPolesCounter = 0;
            rightPolesCounter = 0;
            leftPolesCounter = 0;
            if (pacManPosition.y > ghostPosition.y) {
                let startCountingPoint = ghostPosition.x;
                let foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[startCountingPoint + 1][ghostPosition.y] !== 3) {
                        downPolesCounter++;
                        startCountingPoint++;
                        if (boardToRender[startCountingPoint][ghostPosition.y + 1] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        downPolesCounter = 100;
                        foundWay = true;
                    }
                }
                startCountingPoint = ghostPosition.x;
                foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[startCountingPoint - 1][ghostPosition.y] !== 3) {
                        upPolesCounter++;
                        startCountingPoint--;
                        if (boardToRender[startCountingPoint][ghostPosition.y + 1] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        upPolesCounter = 100;
                        foundWay = true;
                    }
                }
                if (upPolesCounter <= downPolesCounter) {
                    directionToGo = 'up';
                } else {
                    directionToGo = 'down';
                } 
                goToVerifyDirection = false;
                goAround = true;
            } else if (pacManPosition.y < ghostPosition.y) {
                let startCountingPoint = ghostPosition.x;
                let foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[startCountingPoint + 1][ghostPosition.y] !== 3) {
                        downPolesCounter++;
                        startCountingPoint++;
                        if (boardToRender[startCountingPoint][ghostPosition.y - 1] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        downPolesCounter = 100;
                        foundWay = true;
                    }
                }
                startCountingPoint = ghostPosition.x;
                foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[startCountingPoint - 1][ghostPosition.y] !== 3) {
                        upPolesCounter++;
                        startCountingPoint--;
                        if (boardToRender[startCountingPoint][ghostPosition.y - 1] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        upPolesCounter = 100;
                        foundWay = true;
                    }
                }
                if (upPolesCounter <= downPolesCounter) {
                    directionToGo = 'up';
                } else {
                    directionToGo = 'down';
                }
                goToVerifyDirection = false;
                goAround = true;
            } else if (pacManPosition.x < ghostPosition.x) {
                let startCountingPoint = ghostPosition.y;
                let foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[ghostPosition.x][startCountingPoint + 1] !== 3) {
                        rightPolesCounter++
                        startCountingPoint++;
                        if (boardToRender[ghostPosition.x - 1][startCountingPoint] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        rightPolesCounter = 100;
                        foundWay = true;
                    }
                }
                startCountingPoint = ghostPosition.y;
                foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[ghostPosition.x][startCountingPoint - 1] !== 3) {
                        leftPolesCounter++
                        startCountingPoint--;
                        if (boardToRender[ghostPosition.x - 1][startCountingPoint] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        leftPolesCounter = 100;
                        foundWay = true;
                    }
                }
                if (leftPolesCounter < rightPolesCounter) {
                    directionToGo = 'left';
                } else {
                    directionToGo = 'right';
                }
                goToVerifyDirection = false;
                goAround = true;
            } else if (pacManPosition.x > ghostPosition.x) {
                let startCountingPoint = ghostPosition.y;
                let foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[ghostPosition.x][startCountingPoint + 1] !== 3) {
                        rightPolesCounter++
                        startCountingPoint++;
                        if (boardToRender[ghostPosition.x + 1][startCountingPoint] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        rightPolesCounter = 100;
                        foundWay = true;
                    }
                }
                startCountingPoint = ghostPosition.y;
                foundWay = false;
                while (foundWay === false) {
                    if (boardToRender[ghostPosition.x][startCountingPoint - 1] !== 3) {
                        leftPolesCounter++
                        startCountingPoint--;
                        if (boardToRender[ghostPosition.x + 1][startCountingPoint] !== 3) {
                            foundWay = true;
                        }
                    } else {
                        leftPolesCounter = 100;
                        foundWay = true;
                    }
                }
                if (leftPolesCounter <= rightPolesCounter) {
                    directionToGo = 'left';
                } else {
                    directionToGo = 'right';
                }
                goToVerifyDirection = false;
                goAround = true;
            }
        } else if (goAround === true) {
            console.log('goAround')
            if (directionToGo === 'up') {
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } else if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.x = ghostPosition.x - 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (ghostPosition.y < pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y + 1] !== 3 ||
                    ghostPosition.y > pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y - 1] !== 3) {
                    goAround = false;
                    currentAxis = 'y';	
                } 
            } else if (directionToGo === 'down') {
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } else if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.x = ghostPosition.x + 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y]
                ghostChangedPosition = true;
                if (ghostPosition.y < pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y + 1] !== 3 ||
                    ghostPosition.y > pacManPosition.y && boardToRender[ghostPosition.x][ghostPosition.y - 1] !== 3) {
                    goAround = false;
                    currentAxis = 'y';
                }
            } else if (directionToGo === 'right') {
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } else if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.y = ghostPosition.y + 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (ghostPosition.x < pacManPosition.x && boardToRender[ghostPosition.x + 1][ghostPosition.y] !== 3 ||
                    ghostPosition.x > pacManPosition.x && boardToRender[ghostPosition.x - 1][ghostPosition.y] !== 3) {
                    goAround = false;
                    currentAxis = 'x';
                }
            } else if (directionToGo === 'left') {
                if (lastValue === undefined) {
                    lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                } else if (lastValue === 2) {
                    boardToRender[ghostPosition.x][ghostPosition.y] = 6;
                } else {
                    boardToRender[ghostPosition.x][ghostPosition.y] = lastValue;
                }
                ghostPosition.y = ghostPosition.y - 1;
                lastValue = boardToRender[ghostPosition.x][ghostPosition.y];
                ghostChangedPosition = true;
                if (ghostPosition.x < pacManPosition.x && boardToRender[ghostPosition.x + 1][ghostPosition.y] !== 3 ||
                    ghostPosition.x > pacManPosition.x && boardToRender[ghostPosition.x - 1][ghostPosition.y] !== 3) {
                    goAround = false;
                    currentAxis = 'x';
                }
            }
        }
    }
    if (ghostPosition.x === pacManPosition.x && ghostPosition.y === pacManPosition.y) {
        ghostChangedPosition = true;
    } else {
        ghostChangedPosition = false;
    }
}

function setGhostOnBoard() {
    boardToRender[ghostPosition.x][ghostPosition.y] = 5;
}

function resetGameBoard() {
    if (gameBoardContainer.firstChild) {
        gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    }
}

setInterval(function() {
    console.log(maxScore);
    if (ghostGotPacman !== true && score < maxScore) {
        console.log(maxScore);
        resetGameBoard();
        movePacMan();
        if (pacManPosition.x === ghostPosition.x &&
            pacManPosition.y === ghostPosition.y) {
            ghostGotPacman = true;
        }
        setPacManOnBoard();
        if (startGame === true) {
            moveGhost();
            if (pacManPosition.x === ghostPosition.x &&
                pacManPosition.y === ghostPosition.y) {
                ghostGotPacman = true;
            }
            setGhostOnBoard();
            startGame = false;
        }
        if (moveCounter === 2) {
            moveGhost();
            if (pacManPosition.x === ghostPosition.x &&
                pacManPosition.y === ghostPosition.y) {
                ghostGotPacman = true;
            }
            setGhostOnBoard();
            moveCounter = 0;
        }
        renderBoard();
        moveCounter++;
    } else if (score >= maxScore) {
        console.log('you win')
        Winner();
    } else if (ghostGotPacman === true) {
        gameOver();
    }
}, 80);