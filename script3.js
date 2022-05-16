const Player = (name,marker)=>{
    let score = 0;
    const getScore = () => score;
    const resetScore = () => {
        score=0;
        return
    };
    const addScore = () => score += 1;
    const play = (item) =>{
        item.textContent = marker;
        return [item.dataset['x'], item.dataset['y']];
    }
    return {
        name,
        resetScore,
        marker, 
        getScore, 
        addScore, 
        play,

    };
}

// ===== INIT ===== //
// const xButton = document.querySelector('#x');
// const oButton = document.querySelector('#o');
const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');
let isAiActive = false;

// ===== Objects =====//
const gameboard=(()=>{
    const gridContainer = document.querySelector('.grid-container');
    let board = [Array(3).fill(null),Array(3).fill(null),Array(3).fill(null)];
    const generateGrid =()=>{
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
        return items;
    }
    const updateGameboard = (x,y,marker) =>{
        board[y][x] = marker;
    }
    const getGameboard = () => board;
    const resetGameboard = (items) =>{
        items.forEach(item=> item.textContent='');
        board = [Array(3).fill(null),Array(3).fill(null),Array(3).fill(null)];
    }
    
    return{
        generateGrid, 
        updateGameboard, 
        getGameboard, 
        resetGameboard,
    }
})();



const Game=((player1, player2)=>{
    // isFirstMove = true;
    const player1Score = document.querySelector('.score .p1');
    const player2Score = document.querySelector('.score .p2');  
    const play = (e)=>{
        if(isFirstMove && player2.marker==='X'){ turn=!turn; }  
        isFirstMove=false;
        let player;
        turn ? player = player1 : player = player2;
        const coord = player.play(e.target);
        turn = !turn;
        gameboard.updateGameboard(coord[0],coord[1],player.marker);
        e.target.removeEventListener('mousedown',play);
        if(checkWin(gameboard.getGameboard(),player.marker)[0]){
            player.addScore();
            displayScore();
            // do something
            activateWinScreen(player, true);
            // nextRound();
            return;
        } else if(checkDraw(gameboard.getGameboard())){
            // do something
            activateWinScreen(player, false);
            // nextRound();
            return;
        }
        if(isAiActive && player===player1){
            let newTarget = ia.play();
            let falseEvent = {target: document.querySelector(`[data-x = "${newTarget[0]}"][data-y = "${newTarget[1]}"]`)};
            // flag = false;
            play(falseEvent);
        }
    }
    const activateWinScreen = (player, isWin)=>{
        winScreen.classList.add('active');
        document.querySelector('.opacity').classList.add('active');
        let message = 'Draw'
        if(isWin){
            message = `${player.name} Wins!`
        }
        document.querySelector('.win-screen h1').textContent=message;
    }
    const nextRound = ()=>{
        winScreen.classList.remove('active');
        document.querySelector('.opacity').classList.remove('active');
        grids.forEach(grid => grid.removeEventListener('mousedown',play));
        grids.forEach(item => item.addEventListener('mousedown',play));
        isFirstMove = true;
        turn = true;
        gameboard.resetGameboard(grids);
    }
    const checkWin=(board, marker)=>{
        let diag = [], antidiag = [], val;
        marker==='X' ? val = 10 : val = -10;
        // Check Rows and Columns
        l = board.length - 1;
        for(let i=0; i<3; i++){
            if(
                board[i].every(value => value==='X') ||
                board[i].every(value => value==='O')||
                board.map(item=>item[i]).every(value => value==='X') ||
                board.map(item=>item[i]).every(value => value==='O')
            ){
                return [true, val];
            }
            // Create diagonals array
            diag.push(board[i][i]);
            antidiag.push(board[l-i][i]);
        }
        // Check diagonals
        if((diag.every(value => value==='X') || diag.every(value => value==='O')) ||
        (antidiag.every(value => value==='X') || antidiag.every(value => value==='O'))){
            return [true, val];
        }
        return [false, 0];
    }
    const checkDraw = (board)=>{
        // draw = true;
        return board.every(i => i.every(j => j!==null));
        // grids.forEach(item => {if(item.textContent===''){ draw=false }})
        // return draw
    }
    const displayScore = ()=>{
        player1Score.textContent = `${player1.name}: ${player1.getScore()}`;
        player2Score.textContent = `${player2.name}: ${player2.getScore()}`;
    }
    const playButtonPressed=()=>{
        player1NewName = document.querySelector('#player1').value;
        player2NewName = document.querySelector('#player2').value;
        if(player1NewName!==''){player1.name = player1NewName}
        if(player2NewName!==''){player2.name = player2NewName}
        Game.displayScore();
        document.querySelector('.welcome').classList.remove('active');
        document.querySelector('.opacity').classList.remove('active');
    }
    const resetButtonPressed=()=>{
        player1.resetScore();
        player2.resetScore();
        Game.nextRound();
        Game.displayScore();
        document.querySelector('.welcome').classList.add('active');
        document.querySelector('.opacity').classList.add('active');
    }
    let turn = true, isFirstMove = true;
    const grids = gameboard.generateGrid();
    displayScore();
    grids.forEach(item => item.addEventListener('mousedown',play));
    const playButton = document.querySelector('#play');
    playButton.addEventListener('click',playButtonPressed);
    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', resetButtonPressed);
    const winScreen = document.querySelector('.win-screen');
    const nextRoundButton = document.querySelector('#next-round');
    nextRoundButton.addEventListener('click', nextRound);
    return{
        checkWin,
        checkDraw,
        displayScore,
        nextRound,
    }
})(player1, player2);





