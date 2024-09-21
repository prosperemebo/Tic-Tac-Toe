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

const boardEl = document.getElementById('board');
const playerEl = document.getElementById('playerDisplay');

// const state = { ...DEFAULT_STATE, board: { ...DEFAULT_STATE.board } };
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
  checkWinner();
}

function renderPlayer() {
  if (state.currentPlayer === PLAYERS.player1) {
    playerEl.innerHTML = 'Current Player: Player 1';
  } else {
    playerEl.innerHTML = 'Current Player: Player 2';
  }
}

function checkWinner() {
  if (Object.values(state.board).every((val) => val !== null)) {
    alert('Game Over!');

    state.board = DEFAULT_STATE.board;
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
