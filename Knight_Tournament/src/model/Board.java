package model;

import java.awt.*;
import java.util.Arrays;

public class Board {
    private final int size;
    private final Cell[][] cells;
    private Player currentPlayer;
    private Point lastMove;
    private Point selectedKnight;


    public Board(int size) {
        this.size = size;
        this.cells = new Cell[size][size];
        for (Cell[] row : cells) {
            Arrays.fill(row, Cell.EMPTY);
        }
        initializeKnights();
        this.currentPlayer = Player.PLAYER1;
        this.lastMove = null;
    }

    private void initializeKnights() {
        // Place knights at the corners
        cells[0][0] = Cell.BLACK_KNIGHT;
        cells[0][size - 1] = Cell.WHITE_KNIGHT;
        cells[size - 1][0] = Cell.WHITE_KNIGHT;
        cells[size - 1][size - 1] = Cell.BLACK_KNIGHT;
    }

    public boolean moveKnight(int x, int y) {
        // Check selecting a different player's knight 
        if ((currentPlayer == Player.PLAYER1 && cells[x][y] == Cell.BLACK_KNIGHT) ||
            (currentPlayer == Player.PLAYER2 && cells[x][y] == Cell.WHITE_KNIGHT)) {
           // Select  new knight
            selectedKnight = new Point(x, y); 
            return false; // if move isn't completed yet
        }
    
        if (selectedKnight != null) {
            // move
            if (isLShapeMove(selectedKnight.x, selectedKnight.y, x, y) && isMoveAllowed(x, y)) {
                // marking territory
                cells[selectedKnight.x][selectedKnight.y] = (currentPlayer == Player.PLAYER1) ? Cell.BLACK_TERRITORY : Cell.WHITE_TERRITORY;
                // change knight position
                cells[x][y] = (currentPlayer == Player.PLAYER1) ? Cell.BLACK_KNIGHT : Cell.WHITE_KNIGHT;
    
                togglePlayer();
                selectedKnight = null;
                return true; // Move completed
            }
        }
        return false;
    }

    
    private boolean isMoveAllowed(int x, int y) {
        if ((currentPlayer == Player.PLAYER1 && cells[x][y] == Cell.WHITE_KNIGHT) ||
            (currentPlayer == Player.PLAYER2 && cells[x][y] == Cell.BLACK_KNIGHT)) {
            return false;
        }
        return true;
    }
    
    

    private boolean isLShapeMove(int fromX, int fromY, int toX, int toY) {
        int dx = Math.abs(fromX - toX);
        int dy = Math.abs(fromY - toY);
        return (dx == 2 && dy == 1) || (dx == 1 && dy == 2);
    }

    // getters
    public Cell getCell(int x, int y) {
        return cells[x][y];
    }

    public Player getCurrentPlayer() {
        return currentPlayer;
    }


    // change the turn
    private void togglePlayer() {
        currentPlayer = currentPlayer == Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
    }

    public boolean hasWinner() {
        // Check all cells for a win condition
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                Cell cell = cells[row][col];
                if (cell != Cell.EMPTY && checkAdjacentCells(row, col, cell)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean checkAdjacentCells(int x, int y, Cell cellType) {
        // Directions to check for adjacent cells
        int[] dx = {1, 0, 1, -1};  
        int[] dy = {0, 1, 1, 1}; 
        for (int i = 0; i < 4; i++) {
            if (checkLine(x, y, dx[i], dy[i], cellType)) {
                return true;
            }
        }
        return false;
    }

    private boolean checkLine(int x, int y, int dx, int dy, Cell cellType) {
        // Check for 4 adjacent cells of the same type
        int count = 0;
        for (int i = 0; i < 4; i++) {
            int newX = x + i * dx;
            int newY = y + i * dy;
            if (newX >= 0 && newX < size && newY >= 0 && newY < size && cells[newX][newY] == cellType) {
                count++;
            }
        }
        return count == 4;
    }
}
