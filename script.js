const X_CLASS = 'dog'
const CIRCLE_CLASS = 'cat'
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const winningImageElement = document.getElementById('winningImage');
const winningAudioElement = document.getElementById('winningAudio')
const desiredDuration = 7;
const matchReview = document.getElementById('match-review')
let matchHistoryActive = false

let dogeWins = 0;
let catWins = 0;
let draws = 0;

let circleTurn 
let moves = []; 
let currentMove = -1;


const WINNING_COMBINATIONS = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6],
]
const restartButton1 = document.getElementById ('restartButton')
const restartButton2 = document.getElementById ('restartButtonOnScreen')
const restartButton3 = document.getElementById ('restartButtonMatchRev')
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const matchHistoryButton = document.getElementById('matchHistory');

startGame()



restartButton1.addEventListener('click', startGame)
restartButton2.addEventListener('click', startGame)
restartButton3.addEventListener('click', startGame)
previousButton.addEventListener('click', showPreviousMove);
nextButton.addEventListener('click', showNextMove);
matchHistoryButton.addEventListener('click', showMatchHistory);



function startGame(){
    circleTurn = false
    matchHistoryActive = false
    //Clears cells if there are any elements inside//
    cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click',handleClick)
    cell.addEventListener('click', handleClick, {once: true })

    })

    //ends any ongoing audio in the back ground if endgame phase is trigggered//
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
    winningAudioElement.pause();
    winningAudioElement.currentTime = 0

    //following DOMs below will trigger if reset button in endgame or match history was triggered//
    document.querySelector('.win-counts').style.display = 'flex'
    document.querySelector('.gameButtons').style.display = 'flex'
    document.querySelector('.matchReview').style.display = 'none';
    moves = []   
}


function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    const move = {
      cellIndex: Array.from(cellElements).indexOf(e.target),
      player: currentClass,
    };
    moves.push(move);

    //determins decides who is the winner or if the game is a draw//
    //adds to win counter as well//
    if (!matchHistoryActive){
      placeMark(cell, currentClass);
      if (checkWin(currentClass)) {
      if(currentClass===X_CLASS) {
        dogeWins++
      } else {
        catWins++
      }
      updateWinCount();
      console.log('Winner');
      endGame(false);
    } else if (isDraw()) {
      draws++
      updateWinCount()
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }

  }
  
  }

function showMatchHistory() {
  currentMove = -1;
  showNextMove();
  winningMessageElement.classList.remove('show');
  board.style.display = 'grid';
  winningAudioElement.pause();
  winningAudioElement.currentTime = 0
  document.querySelector('.win-counts').style.display = 'none'
  document.querySelector('.gameButtons').style.display = 'none';
  document.querySelector('.matchReview').style.display = 'flex';
  

  matchHistoryActive = true;
  setBoardHoverClass();
  handleClick()

}
  
function showPreviousMove() {
  if (currentMove > 0) {
    currentMove--;
    showMove(currentMove);
  }
}

function showNextMove() {
  if (currentMove < moves.length - 1) {
    currentMove++;
    showMove(currentMove);
  }
}

function showMove(moveIndex) {
  // Clear the board first
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS, CIRCLE_CLASS);
  });

  // Show moves up to the specified index
  for (let i = 0; i <= moveIndex; i++) {
    const move = moves[i];
    const cell = cellElements[move.cellIndex];
    placeMark(cell, move.player);
  }

  // Update the board hover class based on the last move
  circleTurn = moves[moveIndex].player === CIRCLE_CLASS;
  setBoardHoverClass();

  // Enable/disable Previous and Next buttons
  previousButton.disabled = moveIndex === 0;
  nextButton.disabled = moveIndex === moves.length - 1;
}

function endGame(draw) {
    if (draw) {
        winningAudioElement.src = 'images/Cat-Vs-Dog-Fight.mp3'
        winningMessageTextElement.innerText = 'Draw!'
        winningImageElement.src = 'images/fighting.gif';
        winningImageElement.alt = 'DRAW'
        matchHistoryButton.style.display = 'none'
    } else {
        const winner = circleTurn ? 'CAT' : 'DOGE';
        winningMessageTextElement.innerText = `${winner} Wins!`;

        // Set the image source based on the winner
        if (winner === 'CAT') {
            winningAudioElement.src = 'images/Cat-Vs-Dog-Fight.mp3'
            winningImageElement.src = 'images/CAT.png';
            winningImageElement.alt = 'Cat';
            matchHistoryButton.style.display = 'flex'
            
        } else {
            winningAudioElement.src = 'images/Cat-Vs-Dog-Fight.mp3'
            winningImageElement.src = 'images/DOG.png';
            winningImageElement.alt = 'Dog';
            matchHistoryButton.style.display = 'flex'
        }
    }

    winningMessageElement.classList.add('show');
     winningAudioElement.currentTime = 0; 
     winningAudioElement.play();
 
     setTimeout(() => {
         winningAudioElement.pause();
     }, desiredDuration * 1000); 
}

function isDraw (){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) ||
        cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
  
    if (currentClass === CIRCLE_CLASS) {
      placeCatOrDogInCell(cell, "cat");
    } else if (currentClass === X_CLASS) {
      placeCatOrDogInCell(cell, "dog");
    }
  }

function swapTurns() {
    circleTurn = !circleTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  
  // Only add hover class if match history is not active
  if (!matchHistoryActive) {
    if (circleTurn) {
      board.classList.add(CIRCLE_CLASS);
    } else {
      board.classList.add(X_CLASS);
    }
  }
}

function checkWin (currentClass) {
    return WINNING_COMBINATIONS.some (combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}


const catSound = document.getElementById("catSound");
const dogSound = document.getElementById("dogSound");

function placeCatOrDogInCell(cell, type) {
  
  cell.classList.add(type);

  if (type === "cat") {
    catSound.play();
  } else if (type === "dog") {
    dogSound.play();
  }
}



function updateWinCount() {
  const dogeWinsElement = document.getElementById('doge-Wins');
  const catWinsElement = document.getElementById('cat-Wins');
  const drawsElement = document.getElementById('draws');
  dogeWinsElement.innerText = ` Doge Wins: ${dogeWins} `;
  catWinsElement.innerText = ` Cat Wins: ${catWins} `;
  drawsElement.innerText = ` Draws: ${draws}`;
}