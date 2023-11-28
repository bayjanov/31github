package view;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import model.Board;

public class ButtonListener implements ActionListener {

    private final GameWindow gameWindow;
    private final int x;
    private final int y;

    public ButtonListener(GameWindow gameWindow, int x, int y) {
        this.gameWindow = gameWindow;
        this.x = x;
        this.y = y;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        Board board = gameWindow.getBoard();
        if (board.moveKnight(x, y)) {
            gameWindow.updateBoardView();
            gameWindow.updateStatus();
        }
    }
}
