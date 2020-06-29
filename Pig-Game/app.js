/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

//Variable Definition
let scores, roundScore, activePlayer, dice, dice2, gamePlaying, previousDiceScore, previousDice2Score;

initGame();

//Initialize game
function initGame() {
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    previousDiceScore = 0;
    previousDice2Score = 0;

    //Initialize when the page is reload
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'PLAYER 1';
    document.getElementById('name-1').textContent = 'PLAYER 2';
    //Remove all classes
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    //Player 1 should be active when game starts
    document.querySelector('.player-0-panel').classList.add('active');
};

//Change player turns
function changePlayerTurn() {
    //Next Player turn
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    //Restart the score
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    //Change the screen to show the current player
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    //Hide the dice
    document.getElementById('.dice').style.display = 'none';
}

//Roll the dice button function
document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying) {
        let diceImage = document.getElementById('dice-1');
        let diceImage2 = document.getElementById('dice-2');

        //Calculate the dice with random
        dice = Math.floor(Math.random() * 6) + 1;
        dice2 = Math.floor(Math.random() * 6) + 1;
        console.log('Rolling the dice... ', dice, ' ' , dice2);
        //Display the dice and the image
        diceImage.style.display = 'block';
        diceImage.src = 'dice-' + dice + '.png';

        diceImage2.style.display = 'block';
        diceImage2.src = 'dice-' + dice2 + '.png';

        //Update score if the dice is not 1
        if (dice !== 1 || dice2 !== 1) {
            console.log('Previous Score Dice 1: ' + previousDiceScore);
            console.log('Previous Score Dice 2: ' + previousDice2Score);
            //Check if the previous value is 6 and new value is 6
            if ((previousDiceScore === 6 && dice === 6) || (previousDice2Score === 6 && dice2 === 6)) {
                console.log('Two 6 in a row - looses the entire score');
                scores[activePlayer] = 0
                roundScore = 0;
                document.querySelector('#current-' + activePlayer).textContent = '0';
                document.getElementById('score-' + activePlayer).textContent = '0';
                previousDiceScore = 0;
                previousDice2Score = 0;
                changePlayerTurn();
            } else {
                //Store dice value in previous score
                previousDiceScore = dice;
                previousDice2Score = dice2;
                //Add score
                roundScore = roundScore + dice + dice2;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            };
        } else {
            changePlayerTurn();
        };
    }
});

//Hold the score button function
document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        //Add current score to global score
        scores[activePlayer] += roundScore;
        //Update the display
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        //Get value from input
        let inputFinalScore = document.querySelector('.final-score').value;
        let winningScore;

        if (inputFinalScore) {
            winningScore = inputFinalScore;
        } else {
            winningScore = 100;
        };
        //Check if player reached the 100 points
        if (scores[activePlayer] >= winningScore) {
            console.log('Player ' + activePlayer + ' Won!!!');
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER!!!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            gamePlaying = false;
        } else {
            //The other player turns
            changePlayerTurn();
        };
    }
});

//New Game button function
document.querySelector('.btn-new').addEventListener('click', initGame);