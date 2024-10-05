'use strict';

const TILE_TTEMPLATE = `<li class="tile" role="button" data-key=":KEY">:VALUE</li>`;
const PLAYERS = {
  player1: 1,
  player2: 2,
};
const DEFAULT_STATE = {
  currentPlayer: PLAYERS.player1,
  board: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
  },
};

const WINS = {
  '012': true,
  345: true,
  678: true,
  '036': true,
  147: true,
  258: true,
  '048': true,
  246: true,
};

const boardEl = document.getElementById('board');
const playerEl = document.getElementById('playerDisplay');

const state = JSON.parse(JSON.stringify(DEFAULT_STATE));

function renderBoard(cb) {
  if (Object.keys(state.board).length !== 9) {
    throw Error('There are more than nine tiles!');
  }

  boardEl.innerHTML = '';

  for (const key in state.board) {
    const value = state.board[key];
    let template = TILE_TTEMPLATE;

    template = template.replace(':VALUE', value || '');
    template = template.replace(':KEY', key);

    boardEl.insertAdjacentHTML('beforeend', template);
  }

  if (cb) {
    cb();
  }
}

function play(event) {
  const tileEl = event.target.closest('.tile');

  if (!tileEl) return;

  const key = tileEl.dataset.key;

  if (state.board[key]) return;

  // Swap players
  if (state.currentPlayer === PLAYERS.player1) {
    state.board[key] = 'X';
    state.currentPlayer = PLAYERS.player2;
  } else {
    state.board[key] = 'O';
    state.currentPlayer = PLAYERS.player1;
  }

  renderBoard();
  renderPlayer();

  setTimeout(() => {
    checkWinner();
  }, 100);
}

function renderPlayer() {
  if (state.currentPlayer === PLAYERS.player1) {
    playerEl.innerHTML = 'Current Player: Player 1';
  } else {
    playerEl.innerHTML = 'Current Player: Player 2';
  }
}

function checkWinner() {
  const winner = findWinner();

  if (winner) {
    alert(`Player ${winner} won!`);
    
    resetBoard();
    renderBoard();
  }
  
  if (Object.values(state.board).every((val) => val !== null)) {
    alert('It\'s a draw!');

    resetBoard();
    renderBoard();
  }
}

function main() {
  renderBoard();
  renderPlayer();

  console.log('Application has started!');
}

boardEl.addEventListener('click', play);

main();

function findWinner() {
  const winsMap = {};
  let winner = null;

  Object.keys(WINS).forEach((key) => {
    const boardIndexes = key.split('');

    for (let i = 0; i < boardIndexes.length; i++) {
      const position = boardIndexes[i];

      if (!winsMap[key]) {
        winsMap[key] = [state.board[position]];
      } else {
        winsMap[key] = [...winsMap[key], state.board[position]];
      }
    }
  });

  Object.values(winsMap).forEach((wins) => {
    if (wins.every((i) => i === 'X')) {
      winner = PLAYERS.player1;
    } else if (wins.every((i) => i === 'O')) {
      winner = PLAYERS.player2;
    }
  });

  return winner;
}

function resetBoard() {
  state.board = JSON.parse(JSON.stringify(DEFAULT_STATE.board));
}
