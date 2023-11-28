package view;

import java.awt.*;
import javax.swing.*;
import model.Board;
import model.Cell;
import model.Player;

public class GameWindow extends JFrame {

  private final int size;
  private final Board board;
  private final JButton[][] buttons;
  private final JLabel statusLabel;
  JPanel statusPanel = new JPanel();

  public GameWindow(int size) {
    this.size = size;
    this.board = new Board(size);
    this.buttons = new JButton[size][size];

    setTitle("Knight Tournament - " + size + "x" + size);
    setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
    setSize(500, 500);
    setLocationRelativeTo(null); // Center the window

    statusLabel = new JLabel("Dark Knights' turn"); // Default status
    statusLabel.setForeground(Color.WHITE);

    // Create a panel for the status bar
    statusPanel.setPreferredSize(new Dimension(getWidth(), 32));
    statusPanel.add(statusLabel);

    statusPanel.setBackground(new Color(56, 63, 65));

    // Add the panel to the frame
    add(statusPanel, BorderLayout.NORTH);

    JPanel boardPanel = new JPanel();
    boardPanel.setLayout(new GridLayout(size, size));
    initializeBoard(boardPanel);

    add(boardPanel, BorderLayout.CENTER);
  }

  private void initializeBoard(JPanel boardPanel) {
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        JButton button = new JButton();
        buttons[i][j] = button;
        button.addActionListener(new ButtonListener(this, i, j));
        boardPanel.add(button);
        updateButtonAppearance(i, j);
      }
    }
  }

  public void updateButtonAppearance(int x, int y) {
    Cell cell = board.getCell(x, y);
    switch (cell) {
      case BLACK_KNIGHT:
        setIconWithAspectRatio(buttons[x][y], "../icons/dark_knight.png");
        buttons[x][y].setBackground(new Color(207, 208, 208));
        break;
      case WHITE_KNIGHT:
        setIconWithAspectRatio(buttons[x][y], "../icons/white_knight.png");
        buttons[x][y].setBackground(new Color(207, 208, 208));

        break;
      case BLACK_TERRITORY:
        buttons[x][y].setBackground(new Color(56, 63, 65));
        buttons[x][y].setIcon(null);
        break;
      case WHITE_TERRITORY:
        buttons[x][y].setBackground(new Color(248, 248, 248));
        buttons[x][y].setIcon(null);
        break;
      default:
        buttons[x][y].setBackground(new Color(207, 208, 208));
        buttons[x][y].setIcon(null);
        break;
    }
  }

  private void setIconWithAspectRatio(JButton button, String imagePath) {
    ImageIcon originalIcon = new ImageIcon(getClass().getResource(imagePath));
    Image originalImage = originalIcon.getImage();

    // Defining fixed dimensions for the image
    int fixedWidth = 70;
    int fixedHeight = 70;

    // Resizing the image to the fixed dimensions
    Image resizedImage = originalImage.getScaledInstance(
      fixedWidth,
      fixedHeight,
      Image.SCALE_SMOOTH
    );

    // Set the resized image as the icon of the button
    button.setIcon(new ImageIcon(resizedImage));
  }

  public void updateStatus() {
    Player currentPlayer = board.getCurrentPlayer();
    if (board.hasWinner()) {
      statusLabel.setText(
        "Player " +
        (currentPlayer == Player.PLAYER1 ? "White Knigts" : "Black Knigts") +
        " wins!"
      );
      JOptionPane.showMessageDialog(
        this,
        (currentPlayer == Player.PLAYER1 ? "White Knigts" : "Black Knigts") +
        " wins!"
      );
      dispose();
    } else {
      statusLabel.setForeground(
        (
          currentPlayer == Player.PLAYER1
            ? new Color(248, 248, 248)
            : new Color(56, 63, 65)
        )
      );
      statusLabel.setText(
        (
          currentPlayer == Player.PLAYER1 ? "Black Knights'" : "White Knights'"
        ) +
        " turn"
      );
      statusPanel.setBackground(
        (
          currentPlayer == Player.PLAYER1
            ? new Color(56, 63, 65)
            : new Color(248, 248, 248)
        )
      );
    }
  }

  public Board getBoard() {
    return board;
  }

  public void updateBoardView() {
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        updateButtonAppearance(i, j);
      }
    }
  }
}
