(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// 'use strict';
window.onload = function() {
  /////Themes
  var lilsisthemearray = require ('./themes/lil_sis/lil_sis.js');
  var bigsisthemearray = require ('./themes/big_sis/big_sis.js');
  var petsthemearray = require ('./themes/pets/pets.js');
  //// import { shapesthemearray } from './themes/big_sis/big_sis.js';
  ///// import { birdsthemearray } from './themes/lil_sis/lil_sis.js';
  // const numbersthemearray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];


  // used in onSpin
  let player = document.getElementById("currentplayer");
  let firstCard, secondCard;
  /// Imported ////////////
  let activeTheme = document.getElementById("choosetheme");
  let activeSize = document.getElementById("choosesize");
  let mainBoard = document.getElementById("maingameboarddiv");
  // used to set a default theme
  let theme = [];
  // Default values/////
  let tracker1 = undefined;
  let value1 = "";
  let value2 = "";
  let choosensize = 0;
  let count = 0;
  let player1score = 0;
  let player1pairs = 0;
  let player2score = 0;
  let player2pairs = 0;
  let seconds = 0;
  let move = 0;
  let pairsFound = 0;
  let highscore = {};
  let hasFlippedCard = false;
  let twoCardsFlipped = false;
  //////////////// Header Constants////////////////////////
  let time = document.querySelector('.time');
  let moves = document.querySelector('.moves');
  let redo = document.querySelectorAll('.redo');
  let question = document.querySelector('.question');
  let arrow = document.querySelector('.arrow');
  let about = document.querySelector('.about');
  ////////////////// Score Elements/////////////////////////////////////////
  let p1score = document.getElementById("playeronescore");
  let p1pairs = document.getElementById("playeronepairs");
  let p2score = document.getElementById("playertwoscore");
  let p2pairs = document.getElementById("playertwopairs");
  let highscoreNumber = document.querySelector('.highscore');
  let retrieveHighscore = localStorage.getItem('highscore');
  let highscoreSlogan = document.querySelector('.highscoreslogan');
  let winnerSlogan = document.querySelector('.winnerslogan');
  //////////////////// Win Elements ////////////////////////////////////////
  let winOverlay = document.querySelector('.winoverlay');
  /////////////////// Available Themes //////////////////////////////////
  let pets = document.getElementById("petsdiv");
  let bigsis = document.getElementById("bigsisdiv");
  let lilsis = document.getElementById("lilsisdiv");

  ////////////////// Pressed Action - THEMES /////////////////////////////////////
  pets.addEventListener("click", ()=>chooseTheme(petsthemearray));
  bigsis.addEventListener("click", ()=>chooseTheme(bigsisthemearray));
  lilsis.addEventListener("click", ()=>chooseTheme(lilsisthemearray));

  ////////////////////// Available Sizes ////////////////////////////////////
  // Setting Board Size
  let eightcards = document.getElementById("choosesize8");
  let sixteencards = document.getElementById("choosesize16");
  let thirtytwocards = document.getElementById("choosesize32");

  ////////////////// Pressed Action - SIZES /////////////////////////////////////
  eightcards.addEventListener("click", () => {
    choosensize = 8 ;
    createBoard(choosensize, theme);
  });
  sixteencards.addEventListener("click", () => {
    choosensize = 16 ;
    createBoard(choosensize, theme);
  });
  thirtytwocards.addEventListener("click", () => {
    choosensize = 32 ;
    createBoard(choosensize, theme);
  });
  /////////////////////////// Set Theme /////////////////////////////////
  const chooseTheme = (themearray)=>{
    theme = themearray;
    //// Theme chooser gone and th Size chooser apper
    activeTheme.className="none";
    activeSize.className="chooseboardsizemaindiv";
  };

  ////////////////// Creating the game board and cards //////////////////////////////
  const createBoard = (boardsize, array)=>{
    
    let preCards = [];
    let setCards = [];
    let x = [] ;
    for(let i = 0; i< (`${boardsize/2}`); i++){
      let rand = Math.floor(Math.random() * array.length) + 1;
      if (x.includes(rand)) {
        do {
          rand = Math.floor(Math.random() * array.length) + 1;
        } while (x.includes(rand));  
      };
      x.push(rand);
    };
    console.log(x)
    for(let i = 0; i< (`${boardsize/2}`); i++){
      // let x = Math.floor(Math.random() * array.length) + 1; 
      preCards.push(array[x[i]-1]);
      preCards.push(array[x[i]-1]);
    };
    console.log(preCards)
    for (let i = boardsize-1; i>=0; i--){
     let random = Math.floor(Math.random() * i) + 1;
     setCards.push(preCards[random-1]);
     preCards.splice(random-1, 1);
    }
    console.log(setCards)
    let container = document.getElementById("match-container");
    let mainboard
    for(let i = 0; i< boardsize; i++){
      // console.log(JSON.parse(setCards[i-1]));

      let carddiv = document.createElement("div");
      carddiv.className = `card${boardsize} card`;
      carddiv.dataset.id = `${setCards[i].id}`;
      
      let front = document.createElement("div");
      front.className = `front${boardsize}`;

      let back = document.createElement("div");
      back.className = `back${boardsize}`;
      back.innerHTML = setCards[i].img;

      carddiv.appendChild(front);
      carddiv.appendChild(back);

      container.appendChild(carddiv);
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => card.addEventListener('click', flipping));
    }
    // Set Board Style
    timer()
    container.id=`match-container${boardsize}`;

    //// Size chooser gone and the Main board apper
    activeSize.className="none";
    mainBoard.className=`maingameboarddiv${boardsize}`;

  }

  //////////////// Action for when player clicks a card

  function flipping() {
    console.log('click');
    if (twoCardsFlipped) return;
    if (this === firstCard) return;
    this.classList.toggle('flipper');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    } else {
      hasFlippedCard = false;
      secondCard = this;
      checkMatch();
    }
  }
  // Matching section ///////////////////////////
  function checkMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;
    isMatch ? itsAMatch() : noMatch();
  }
  function itsAMatch() {
    firstCard.removeEventListener('click', flipping);
    secondCard.removeEventListener('click', flipping);
    countMoves();
    win();
  }
  function noMatch() {
    twoCardsFlipped = true;
    setTimeout( _ => {
      firstCard.classList.remove('flipper');
      secondCard.classList.remove('flipper');
      twoCardsFlipped = false;
      countMoves();
      nextPlayer()
      }, 1200);
  }
  // End of Matching section /////////////////////////

  // Move Count section ////////////////////////////
  function countMoves() {
    [hasFlippedCard, twoCardsFlipped] = [false, false];
    [firstCard, secondCard] = [null, null];
    // Set Player 1 Score
    if (player.innerHTML === "Player 1") {
      // console.log("player 1 scores!");
      player1score += 1;
      p1score.innerHTML = player1score;
    };
    if (player.innerHTML === "Player 2") {
      // console.log("player 1 scores!");
      player2score += 1;
      p2score.innerHTML = player2score;
    };
  }
  // End of Count move //////////////////////////////

  ////// Next player function ////////////////////////////////////
  function nextPlayer() {
    if(player.innerHTML === "Player 1") {    
      player.innerHTML = "Player 2"
    } else {
      player.innerHTML = "Player 1";
    };
  };
  /////////// End of next plater function /////////////////////////////

  /////////// Win section /////////////////////////////

  function win() {
    if (player.innerHTML === "Player 1") {
      // console.log("player 1 scores!");
      player1pairs += 1;
      p1pairs.innerHTML = player1pairs;
    };
    if (player.innerHTML === "Player 2") {
      // console.log("player 1 scores!");
      player2pairs += 1;
      p2pairs.innerHTML = player2pairs;
    };
    pairsFound += 1;
    if (pairsFound === (choosensize)/2) {
      // stopClock ()
      if (player1pairs > player2pairs) {
        move = player1score;
        moves.innerText = `${move}`;
        winnerSlogan.innerText = `Player 1 WINS by ${move} moves`;
      } else if (player1pairs === player2pairs) {
        move = player1score;
        moves.innerText = `${move}`;
        winnerSlogan.innerText = `You both WINNERS`;
      } else if (player1pairs < player2pairs) {
        move = player2score;
        moves.innerText = `${move}`;
        winnerSlogan.innerText = `Player 2 WINS by ${move} moves`;
      }

      winOverlay.classList.toggle('hide');
      let finalTime = document.querySelector('.finaltime');
      finalTime.innerText = `${seconds}`;
      let finalMoves = document.querySelector('.finalmoves');
      finalMoves.innerText = Number(`${player1score}`) + Number(`${player2score}`);
      calcHighscore();
    }
  }
  ///////  End of Win Section  ///////////////////////////////////////////////

  /////////////Score Section////////////////////////////////////////////////
  // function setInitialHighScoreCache () {
  let highscoreInit = Object.assign({ 'moves':  0 });
  localStorage.setItem('highscore', JSON.stringify(highscoreInit));

  // }
  function calcHighscore() {
    // let scores = { 'moves': `${move}` };
    highscore = Object.assign({ 'moves': `${move}` });
    console.log(retrieveHighscore)
    let movesForHighscore = JSON.parse(retrieveHighscore).moves;
    if (movesForHighscore < move && movesForHighscore != 0) {
      highscoreSlogan.innerText = `Your current highscore is ${movesForHighscore} moves - try again to beat it.`;
    } else if (movesForHighscore == move) {
      highscoreSlogan.innerText = `That was close, just one move less for a new highscore! Your highscore is still ${movesForHighscore} moves.`;
    } else if (movesForHighscore > move) {
      highscoreSlogan.innerText = `Congratulations, you beat your highscore! Your new highscore is ${move} moves.`;
      setHighscoreCache();
    } else {
      highscoreSlogan.innerText = `You finished your first game! Your new highscore is ${move} moves.`;
      setHighscoreCache();
    }
  }
   highscoreNumber.innerHTML = JSON.parse(retrieveHighscore).moves
  function setHighscoreCache() {
    highscoreNumber.innerText = `${move}`;
    localStorage.setItem('highscore', JSON.stringify(highscore));
  }
  /////////////End of Score Section////////////////////////////////////

  ///////////////Set Time ///////////////////
  function timer() {
    var startClock = setInterval((timming),1000);
    function timming() {
      if (pairsFound === (choosensize)/2) {
        clearInterval(startClock); 
      } else {
        seconds += 1;
        time.innerText = `${seconds}`;
      }
    }
  }
  //////////////////End Time/////////////////////////
  ////////////// Restart ////////////////////////////////////
  redo.forEach(button => button.addEventListener('click', _ => { location.reload(); 'highscore', JSON.stringify(highscore)}));
  ////////////// About menu ////////////////////////////////////
  question.addEventListener('click', _ => { about.classList.toggle('aboutHide')});
  arrow.addEventListener('click', _ => { about.classList.toggle('aboutHide')});
};



},{"./themes/big_sis/big_sis.js":2,"./themes/lil_sis/lil_sis.js":3,"./themes/pets/pets.js":4}],2:[function(require,module,exports){
const bigsisarray = [
	{
		id : 1,
		img : `<img data-id="1" src="themes/big_sis/big_hoops.jpg" height="100px" width="100px"/>`
	}, 
	{
		id : 2,
		img : `<img data-id="2" src="themes/big_sis/bigsis_babyglam.jpg" height="100px" width="100px"/>`
	}, 
	{
		id : 3,
		img : `<img data-id="3" src="themes/big_sis/bigsis_ballerina.jpg" height="100px" width="100px"/>`
	},
	{
		id : 4,
		img : `<img data-id="4" src="themes/big_sis/bigsis_brrr_bb_glam_glitter.jpg" height="100px" width="100px"/>`
	},
	{
		id : 5,
		img : `<img data-id="5" src="themes/big_sis/bigsis_cards.jpg" height="100px" width="100px"/>`
	},
	{
		id : 6,
		img : `<img data-id="5" src="themes/big_sis/bigsis_sleeping.jpg" height="100px" width="100px"/>`
	},
	{
		id : 7,
		img : `<img data-id="7" src="themes/big_sis/bigsis_curious_qt_glam_glitter.jpg" height="100px" width="100px"/>`
	},
	{
		id : 8,
		img : `<img data-id="8" src="themes/big_sis/bigsis_dj_glam_glitter.jpg" height="100px" width="100px"/>`
	},
	{
		id : 9,
		img : `<img data-id="9" src="themes/big_sis/bigsis_dusti.jpg" height="100px" width="100px"/>`
	},
	{
		id : 10,
		img : `<img data-id="10" src="themes/big_sis/bigsis_fancygirl.jpg" height="100px" width="100px"/>`
	},
	{
		id : 11,
		img : `<img data-id="11" src="themes/big_sis/bigsis_confetti.jpg" height="100px" width="100px"/>`
	},
	{
		id : 12,
		img : `<img data-id="12" src="themes/big_sis/bigsis_ironOntransfer.jpg" height="100px" width="100px"/>`
	},
	{
		id : 13,
		img : `<img data-id="13" src="themes/big_sis/bigsis_kitty_queen_glam_glitter.jpg" height="100px" width="100px"/>`
	},
	{
		id : 14,
		img : `<img data-id="14" src="themes/big_sis/bigsis_Lotta.jpg" height="100px" width="100px"/>`
	},
	{
		id : 15,
		img : `<img data-id="15" src="themes/big_sis/bigsis_Luxe.jpg" height="100px" width="100px"/>`
	},
	{
		id : 16,
		img: `<img data-id="16" src="themes/big_sis/bigsis_mermaid.jpg" height="100px" width="100px"/>`
	}
];

module.exports = bigsisarray;
},{}],3:[function(require,module,exports){
const lilsisarray = [
	{
		id : 1,
		img : `<img data-id="1" src="themes/lil_sis/lil_80s_bb.jpg" height="100px" width="100px"/>`
	}, 
	{
		id : 2,
		img : `<img data-id="2" src="themes/lil_sis/lil_babeinthewoods.jpg" height="100px" width="100px"/>`
	}, 
	{
		id : 3,
		img : `<img data-id="3" src="themes/lil_sis/lil_bigcityBB.jpg" height="100px" width="100px"/>`
	},
	{
		id : 4,
		img : `<img data-id="4" src="themes/lil_sis/lil_luxe.jpg" height="100px" width="100px"/>`
	},
	{
		id : 5,
		img : `<img data-id="5" src="themes/lil_sis/lil_roller.jpg" height="100px" width="100px"/>`
	},
	{
		id : 6,
		img : `<img data-id="5" src="themes/lil_sis/lil_scribbles.jpg" height="100px" width="100px"/>`
	},
	{
		id : 7,
		img : `<img data-id="7" src="themes/lil_sis/lil_shimonequeen.jpg" height="100px" width="100px"/>`
	},
	{
		id : 8,
		img : `<img data-id="8" src="themes/lil_sis/lil_sk8erboi.jpg" height="100px" width="100px"/>`
	},
	{
		id : 9,
		img : `<img data-id="9" src="themes/lil_sis/lil_asifbaby.jpg" height="100px" width="100px"/>`
	},
	{
		id : 10,
		img : `<img data-id="10" src="themes/lil_sis/lil_babycartoon.jpg" height="100px" width="100px"/>`
	},
	{
		id : 11,
		img : `<img data-id="11" src="themes/lil_sis/lil_dawn.jpg" height="100px" width="100px"/>`
	},
	{
		id : 12,
		img : `<img data-id="12" src="themes/lil_sis/lil_kansasQT.jpg" height="100px" width="100px"/>`
	},
	{
		id : 13,
		img : `<img data-id="13" src="themes/lil_sis/lil_kittyqueen.jpg" height="100px" width="100px"/>`
	},
	{
		id : 14,
		img : `<img data-id="14" src="themes/lil_sis/lil_missjive.jpg" height="100px" width="100px"/>`
	},
	{
		id : 15,
		img : `<img data-id="15" src="themes/lil_sis/lil_splatters.jpg" height="100px" width="100px"/>`
	},
	{
		id : 16,
		img: `<img data-id="16" src="themes/lil_sis/lil_yangQT.jpg" height="100px" width="100px"/>`
	}
];

module.exports = lilsisarray;
},{}],4:[function(require,module,exports){
const petsarray = [
	{
		id : 1,
		img : `<img data-id="1" src="themes/pets/pets_4funkykat.jpg" height="100px" width="100px"/>`
	}, 
	{
		id : 2,
		img : `<img data-id="2" src="themes/pets/pets_4showpony.jpg" height="100px" width="100px"/>`
	}, 
	{
		id : 3,
		img : `<img data-id="3" src="themes/pets/pets_babydog.jpg" height="100px" width="100px"/>`
	},
	{
		id : 4,
		img : `<img data-id="4" src="themes/pets/pets_bonbonham.jpg" height="100px" width="100px"/>`
	},
	{
		id : 5,
		img : `<img data-id="5" src="themes/pets/pets_crystalbunny.jpg" height="100px" width="100px"/>`
	},
	{
		id : 6,
		img : `<img data-id="5" src="themes/pets/pets_divacolor.jpg" height="100px" width="100px"/>`
	},
	{
		id : 7,
		img : `<img data-id="7" src="themes/pets/pets_djk9.jpg" height="100px" width="100px"/>`
	},
	{
		id : 8,
		img : `<img data-id="8" src="themes/pets/pets_fuzzyfan.jpg" height="100px" width="100px"/>`
	},
	{
		id : 9,
		img : `<img data-id="9" src="themes/pets/pets_googoomewmew.jpg" height="100px" width="100px"/>`
	},
	{
		id : 10,
		img : `<img data-id="10" src="themes/pets/pets_headphones.jpg" height="100px" width="100px"/>`
	},
	{
		id : 11,
		img : `<img data-id="11" src="themes/pets/pets_hophop.jpg" height="100px" width="100px"/>`
	},
	{
		id : 12,
		img : `<img data-id="12" src="themes/pets/pets_hopskittea.jpg" height="100px" width="100px"/>`
	},
	{
		id : 13,
		img : `<img data-id="13" src="themes/pets/pets_mchammy.jpg" height="100px" width="100px"/>`
	},
	{
		id : 14,
		img : `<img data-id="14" src="themes/pets/pets_mermaid.jpg" height="100px" width="100px"/>`
	},
	{
		id : 15,
		img : `<img data-id="15" src="themes/pets/pets_purrrbaby.jpg" height="100px" width="100px"/>`
	},
	{
		id : 16,
		img: `<img data-id="16" src="themes/pets/pets_shortstophop.jpg" height="100px" width="100px"/>`
	}
];

module.exports = petsarray;
},{}]},{},[1]);
