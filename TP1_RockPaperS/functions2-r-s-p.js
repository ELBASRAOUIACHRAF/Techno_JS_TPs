let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();



document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
  });

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
  });

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
  });


  /*
  Add an event listener
  if the user presses the key r => play rock
  if the user presses the key p => play paper
  if the user presses the key s => play scissors
  */

  document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
      playGame('rock');
    } else if (event.key === 'p') {
      playGame('paper');
    } else if (event.key === 's') {
      playGame('scissors');
    }
  });


function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = '';

  if (playerMove === computerMove) {
    result = 'Tie';
    score.ties += 1;
  }

  if (playerMove === 'paper'){
    if(computerMove === 'rock'){
      result = 'You Win';
      score.wins += 1;
    }else if(computerMove === 'scissors'){
      result = 'You Lose';
      score.losses += 1;
  }
}

  if (playerMove === 'rock'){
    console.log('Player move is rock');
    if(computerMove === 'paper'){
      result = 'You Lose';
      score.losses += 1;
    }else if(computerMove === 'scissors'){
      result = 'You Win';
      score.wins += 1;
    }
  }

  if (playerMove === 'scissors'){
    console.log('Player move is scissors');
    if(computerMove === 'rock'){
      result = 'You Lose';
      score.losses += 1;
    }else if(computerMove === 'paper'){
      result = 'You Win';
      score.wins += 1;
    }
  }

  localStorage.setItem('score', JSON.stringify(score));
  
console.log(result);
console.log(score);
console.log('Computer move ' + computerMove);
console.log('Player move ' + playerMove);

  document.querySelector('.js-result').innerHTML = result;
  let playerMoveImage = '/images/' + playerMove + '-emoji.png';
  let computerMoveImage = '/images/' + computerMove + '-emoji.png';
  document.querySelector('.js-moves').innerHTML = `You <img src = ${playerMoveImage}>  <img src = ${computerMoveImage}> Computer`;
  updateScoreElement();
}


function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}