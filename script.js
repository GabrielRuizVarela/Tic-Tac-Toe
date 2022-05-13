// ----- INIT ----- //
// const gridContainer = document.querySelector('.grid-container');
// generateGrid();
// ----- OBJECTS----- //

const gameboard=(()=>{
    const gridContainer = document.querySelector('.grid-container');
    let board = [Array(3).fill(null),Array(3).fill(null),Array(3).fill(null)];
    const resetGameboard = () =>{
        const items = document.querySelectorAll('.item');
        items.forEach(item=> item.removeEventListener('mousedown',plays));
        items.forEach(item=> item.addEventListener('mousedown',plays));
        items.forEach(item=> item.textContent='');
        board = [Array(3).fill(null),Array(3).fill(null),Array(3).fill(null)];
        turn = false;
    }
    const getGameboard = () => board;
    const generateGrid =()=>{
        gridContainer.innerHTML = '';
        let items = [];
        for(let y=0; y<3; y++){
            for(let x=0;x<3;x++){
                let item = document.createElement('div');
                item.setAttribute('data-x',x);
                item.setAttribute('data-y',y);
                item.classList.add('item');
                items.push(gridContainer.appendChild(item));
            }
        }
        items.forEach(item=> item.addEventListener('mousedown',plays));
        return items;
    }
    const updateGameboard = (x,y,marker) =>{
        board[y][x] = marker;
    }
    const checkWin=()=>{
        let diag = [], antidiag = [];
        // Check Rows
        l = board.length - 1;
        for(let i=0; i<3; i++){
            if(board[i].every(value => value==='X') ||
                board[i].every(value => value==='O')){
                return true;
            }
            // Check Columns
            if(board.map(item=>item[i]).every(value => value==='X') ||
                board.map(item=>item[i]).every(value => value==='O')){
                return true;
            }
            // Create diagonals array
            diag.push(board[i][i]);
            antidiag.push(board[l-i][i]);
        }
        // Check diagonals
        if((diag.every(value => value==='X') || diag.every(value => value==='O')) ||
            (antidiag.every(value => value==='X') || antidiag.every(value => value==='O'))){
            return true;
        }
        return false;
    }
    return {generateGrid, resetGameboard ,getGameboard, updateGameboard, checkWin};
})();

const Player = (name,marker,gameboard)=>{
    let score = 0;
    const getScore = () => score;
    const play = (item) =>{
        item.textContent = marker;
        gameboard.updateGameboard(item.dataset['x'],item.dataset['y'],marker);
        if(gameboard.checkWin()){
            console.log(`${ name } Wins`)
            score+=1;
            displayScore();
            gameboard.resetGameboard();
        }
        item.removeEventListener('mousedown',plays);
    }
    return {name, marker, getScore, play};
}

// ----- FUNCTIONS ----- //

function plays(e){
    let item = e.target;
    if (turn){
        player1.play(item);
        turn = !turn;
    } else {
        player2.play(item);
        turn = !turn;
    }
}

const displayScore = ()=>{
    player1Score.textContent = `Player 1: ${player1.getScore()}`;
    player2Score.textContent = `Player 2: ${player2.getScore()}`;
}

// ----- ELEMENTS ----- //


const xButton = document.querySelector('#x');
const oButton = document.querySelector('#o');
const player1 = Player('Player 1', xButton.innerHTML, gameboard);
const player2 = Player('Player 2',oButton.innerHTML, gameboard);
let turn = true;
const player1Score = document.querySelector('.score .p1');
const player2Score = document.querySelector('.score .p2');

// ----- EVENT LISTENERS ----- //

// xButton.addEventListener('click',)


// ----- RUN ----- //
gameboard.generateGrid();
displayScore();

