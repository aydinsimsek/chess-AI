## Demonstration  
![chess-AI](https://user-images.githubusercontent.com/43919074/184537623-653cff23-4471-4e0c-9e55-7c3aece0de38.gif)

## The Algorithm Behind
Given a specified search depth, let's call it *N*, the optimal move is decided considering every possible board state ended up from the current position within *N* moves. Note that, the board state is calculated according to the weights and positions of the pieces on the board.  

The number of evaluated moves are limited by pruning the search when it's decided that the opponent's choosing a particular move is not logical. With this optimization technique, the speed of the search process is increased remarkably.    

As it can be seen in the demonstration, if capturing a piece would result in losing a more valuable piece, AI does not greedily capture that piece; it simply avoids the capturing even if there is a threat of being captured.  

On the other hand, it's not that wise when it comes to the endgames. Since this algorithm does not teach how to force a checkmate, it sometimes blows up a huge lead when it's in a winning position.  

## Try It Out
https://aydinsimsek.github.io/chess-AI/
