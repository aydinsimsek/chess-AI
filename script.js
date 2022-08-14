var config = 
{
    draggable: true, 
    position: 'start',   
    onMouseoverSquare: onMouseoverSquare,
    onMouseoutSquare: onMouseoutSquare,
    onDrop: onDrop
};
var board = ChessBoard('board', config);
var whiteSquareGrey = '#a9a9a9'; 
var blackSquareGrey = '#696969'; 
var blackState = 0;
var whiteState = 0; 
var evalPositions = 0; 
  
var weights = {p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000}; 

/*****************************************
 * Piece-square table for white pieces 
******************************************/
var pst_w = 
{ 
    p: [
        [0,  0,  0,  0,  0,  0,  0,  0],    
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    n: [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    b: [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20] 
    ],
    r: [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0] 
    ],
    q: [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    k: [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
    ]
}; 

/*****************************************
 * Piece-square table for black pieces
******************************************/   
var pst_b = 
{
    p: pst_w['p'].slice().reverse(),
    n: pst_w['n'].slice().reverse(),
    b: pst_w['b'].slice().reverse(),
    r: pst_w['r'].slice().reverse(), 
    q: pst_w['q'].slice().reverse(),
    k: pst_w['k'].slice().reverse()
};

var game = new Chess(); 

function removeGreySquares() 
{
    $('#board .square-55d63').css('background', ''); 
}

function greySquare(square)
{
    var $square = $('#board .square-' + square); 

    var background = whiteSquareGrey; 
    if ($square.hasClass('black-3c85d')) 
    {
        background = blackSquareGrey;
    }

    $square.css('background', background); 
}

/****************************************************************
 * Higlights the latest move's source and target squares 
*****************************************************************/
function highlightLatestMove(source, target)
{
    $('#board').find('.square-55d63').removeClass('highlight'); 
    $('#board').find('.square-' + source).addClass('highlight');
    $('#board').find('.square-' + target).addClass('highlight');
}

/*****************************************************************
 * Calculates the piece's value based on its weight and position 
******************************************************************/   
function getVal(piece, row, col)   
{
    if(piece.color === 'w')
        return weights[piece.type] + pst_w[piece.type][row][col]; 
    else 
        return weights[piece.type] + pst_b[piece.type][row][col];   
}

/********************************************************************************
 * Evaluates the board state with respect to the white pieces  
 * Returns the total value of the white pieces - total value of the black pieces
*********************************************************************************/
function boardState()  
{ 
    blackState = 0;
    whiteState = 0;   
    var boardArr = game.board();  
    for(var row = 0; row < 8; row++) 
    {
        for(var col = 0; col < 8; col++)
        {
            var piece = boardArr[row][col];
            if(piece !== null)
            {
                var val = getVal(piece, row, col);        
                if(piece.color === 'w')   
                    whiteState += val; 
                else
                    blackState += val; 
            }
        }
    }
    return whiteState - blackState; 
}

/***********************************************************************************
 * Updates the progress bar that indicates the advantageous side 
************************************************************************************/
function updateRatio()
{
    var ratio = document.getElementById("progress");  
    ratio.value = (blackState - 20000) / (blackState + whiteState - 40000) * 100;   
}

/************************************************************************************** 
* Helper function that randomly reorders the array elements 
* The Fisher–Yates shuffle algorithm is used to get an 'unbiased' shuffling 
***************************************************************************************/  
function shuffle(arr)
{
    for(var i = arr.length - 1; i > 0; i--)   
    {
        var randIdx = Math.floor(Math.random() * (i + 1)); 

        var tmp = arr[i]; 
        arr[i] = arr[randIdx]; 
        arr[randIdx] = tmp; 
    }
    return arr; 
}

/************************************************************************************ 
* Minimax algoritm with alpha-beta pruning 
* This algorithm is based on the assumption that the opponent will make logical moves 
*************************************************************************************/ 
function minimax(depth, alpha, beta, isMaximizing) 
{ 
    var legalMoves = game.ugly_moves();   
    if(depth === 0 || legalMoves.length === 0) 
        return boardState(); 
    
    evalPositions++;

    // white-side
    if(isMaximizing)
    {
        var bestVal = Number.NEGATIVE_INFINITY; 
        for(var i = 0; i < legalMoves.length; i++)
        {
            game.ugly_move(legalMoves[i]); 
            bestVal = Math.max(bestVal, minimax(depth-1, alpha, beta, false)); 
            game.undo(); 
            alpha = Math.max(alpha, bestVal); 
            // minimizer won't follow this path, so prune the search from this point on
            if(beta < alpha) 
                break; 
        }
        return bestVal; 
    }

    // black-side 
    else 
    {
        var bestVal = Number.POSITIVE_INFINITY;
        for(var i = 0; i < legalMoves.length; i++)
        {
            game.ugly_move(legalMoves[i]); 
            bestVal = Math.min(bestVal, minimax(depth-1, alpha, beta, true)); 
            game.undo(); 
            beta = Math.min(beta, bestVal);  
            // maximizer won't follow this path, so prune the search from this point on     
            if(beta < alpha)   
                break;
        }
        return bestVal;  
    }
}

function optimalMove()
{
    evalPositions = 0; 
    var optimal = null;   
    var bestVal = Number.POSITIVE_INFINITY;          
    var legalMoves = game.ugly_moves();     
    // shuffle the legalmoves array to decrease the chances of the threefold repetition  
    legalMoves = shuffle(legalMoves);       
    var depth = 3; 
    for(var i = 0; i < legalMoves.length; i++)
    {
        var currMove = legalMoves[i];  
        game.ugly_move(currMove);  
        var currVal = minimax(depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);  
        game.undo();  
        if(currVal < bestVal)    
        { 
            optimal = currMove;  
            bestVal = currVal; 
        }
    }  
    return optimal;  
}

function makeMove()
{
    if(game.game_over()) 
        printGameState(); 
    else 
    {
        var t1 = new Date().getTime();      
        var optimal = optimalMove(); 
        var t2 = new Date().getTime();  
        var timespan = (t2-t1) / 1000;
        $('#count').text(evalPositions);
        $('#timespan').text(timespan); 
        $('#positions-per-sec').text(Math.round(evalPositions/timespan));    
        var currMove = game.ugly_move(optimal);  
        highlightLatestMove(currMove.from, currMove.to);   
        board.position(game.fen()); 
        updateRatio();     
        if(game.game_over())
            window.setTimeout(printGameState, 500);    
    }
}

function printGameState() 
{
    if(game.in_checkmate())
        alert('Checkmate!');  
    else
    {
        if(game.insufficient_material()) 
            alert('Draw by insufficient material');
        else if(game.in_stalemate())
            alert('Draw by stalemate');
        else if(game.in_threefold_repetition())
            alert('Draw by threefold repetition'); 
        else 
            alert('Draw by 50-move rule'); 
    }
}

function onDrop(source, target)
{
    removeGreySquares(); 
    // always promote to a queen for simplicity  
    var move = game.move({from: source, to: target, promotion: 'q'});  
    // if the move is illegal, preserve the latest position     
    if(move === null) 
        return 'snapback';  
    highlightLatestMove(source, target);    
    window.setTimeout(makeMove, 100); 
}

function onMouseoverSquare(square, piece)
{
    var moves = game.moves({square: square, verbose: true}); 
    if (moves.length !== 0) 
    {
        // highlight the square moused over
        greySquare(square);    
        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++)
            greySquare(moves[i].to); 
    }
}

function onMouseoutSquare(square, piece)  
{
    removeGreySquares(); 
}