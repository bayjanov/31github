/**
 * Sample Skeleton for 'chess.fxml' Controller Class
 */
package hu.unideb.inf.controller;

import hu.unideb.inf.FunctionsLibrary.FunctionsLib;
import hu.unideb.inf.customControls.Knight;
import hu.unideb.inf.main.MainApp;
import hu.unideb.inf.model.state.*;
import hu.unideb.inf.model.*;
import hu.unideb.inf.model.result.*;
import java.awt.Point;
import java.io.IOException;
import java.net.URL;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.collections.*;
import javafx.event.ActionEvent;
import javafx.fxml.*;
import javafx.scene.*;
import javafx.scene.control.*;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Pane;
import javafx.stage.*;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller Class for Chess.fxml.
 *
 * @author ssht
 * @version $Id: $Id
 */
@Slf4j
public class FXMLChess {

    @FXML // ResourceBundle that was given to the FXMLLoader
    private ResourceBundle resources;
    @FXML // URL location of the FXML file that was given to the FXMLLoader
    private URL location;
    @FXML // fx:id="chessBoardView"
    private GridPane chessBoardView; // Value injected by FXMLLoader
    @FXML
    private Button giveUpBUtton;
    @FXML
    private Label tunLabel;

    private Knight blackKnight;
    private Knight whiteKnight;
    private Knight clickedKnight;

    GameState gameState = new GameState();
    GameResultDao gameResultDAO;
    PlayerDao playerDao;

    private boolean isWhiteLastMove = false;
    private boolean isBlackLastMove = false;
    private int lastMoveCount = 0;
    private Point knightPreviousLocation = new Point();
    private ObservableList<Pane> availablePanesToMove = FXCollections.observableArrayList();

    /**
     * <p>
     * This method will come to play when user click any pane. </p>
     *
     * <p>
     * It will change the location of Knight Accordingly.</p>
     *
     * <p>
     * It will call Changed Turn Method to Chnage Turn.</p>
     *
     * @param event Event called after mouse clicked
     *
     */
    @FXML
    void paneMouseClicked(MouseEvent event) {
        int rowIndex = (GridPane.getRowIndex((Node) event.getSource()) == null) ? 0 : GridPane.getRowIndex((Node) event.getSource());
        int colIndex = (GridPane.getColumnIndex((Node) event.getSource()) == null) ? 0 : GridPane.getColumnIndex((Node) event.getSource());
        if (availablePanesToMove.contains((Pane) event.getSource()) && event.getSource() instanceof Pane) {

            knightPreviousLocation = new Point(GridPane.getColumnIndex(clickedKnight) == null ? 0 : GridPane.getColumnIndex(clickedKnight),
                    GridPane.getRowIndex(clickedKnight) == null ? 0 : GridPane.getRowIndex(clickedKnight));

            ObservableList<Node> childrens = chessBoardView.getChildren();
            for (Node node : childrens) {
                if ((knightPreviousLocation.x == (GridPane.getColumnIndex(node) == null ? 0 : GridPane.getColumnIndex(node)))
                        && (knightPreviousLocation.y == (GridPane.getRowIndex(node) == null ? 0 : GridPane.getRowIndex(node)))) {

                    if (node instanceof Pane) {
                        ((Pane) node).setStyle("-fx-background-color: #800000");
                        log.info("Move Added to Display");
                    }

                }
            }
            //Turn Changed
            gameState.advanceTurnPlayer();
            log.info("Player turn changed to {}", gameState.getPlayer(gameState.getTurnPlayer()).getName());
            availablePanesToMove.forEach((pane) -> resetColors(rowIndex, colIndex, pane));
            GridPane.setConstraints(clickedKnight, colIndex, rowIndex);
            ((Player) gameState.getPlayer(clickedKnight.getKnightId())).setRow(rowIndex);
            ((Player) gameState.getPlayer(clickedKnight.getKnightId())).setCol(colIndex);
            availablePanesToMove = FXCollections.observableArrayList();

            Point restrictedPSquare = ((Player) gameState.getPlayer(clickedKnight.getKnightId())).getCurrentLocation();
            GameState.AddRestricted(restrictedPSquare);
            log.info("Added new Pane in Restricted Squares with Row: {} and Col: {}", restrictedPSquare.x, restrictedPSquare.y);
            setPaneClickEvent();

        } else {
            log.warn("You've clicked at Square ({},{}), but it is not availble suqare to move", rowIndex, colIndex);
        }
    }

    /**
     * <p>
     * This method will reset color of Pane after movement of knight.</p>
     *
     * <p>
     * It will be called for every pane exists.</p>
     *
     * @param rowIndex row Index of clicked pane
     * @param colIndex col Index of clicked Pane
     * @param pane pane
     * @throws IOException
     */
    private void resetColors(int rowIndex, int colIndex, Pane pane) {
        if (rowIndex % 2 == 0 && colIndex % 2 == 0) {

            pane.setStyle("-fx-background-color: white;");
        } else if (rowIndex % 2 != 0 && colIndex % 2 == 0) {
            pane.setStyle("-fx-background-color: #808080;");
        } else if (rowIndex % 2 == 0 && colIndex % 2 != 0) {
            pane.setStyle("-fx-background-color: #808080;");
        } else {
            pane.setStyle("-fx-background-color: white;");
        }

    }

    @FXML // This method is called by the FXMLLoader when initialization is complete
    void initialize() {

        Player p1 = new Player(Data.getP1(), false, 0);
        Player p2 = new Player(Data.getP2(), true, 1);

        gameResultDAO = GameResultDao.getInstance();
        playerDao = PlayerDao.getInstance();

        Optional<Player> data = playerDao.find(p1.getName());
        data.ifPresent((Player d) -> {
            p1.setWinCount(d.getWinCount());
        });

        Optional<Player> data0 = playerDao.find(p2.getName());
        data0.ifPresent((Player d) -> {
            p2.setWinCount(d.getWinCount());
        });

        gameState = new GameState(p1, p2);
        whiteKnight = new Knight(true, 1);
        blackKnight = new Knight(false, 0);

        chessBoardView.add(whiteKnight, gameState.getWhitePlayer().getCol(), gameState.getWhitePlayer().getRow());
        chessBoardView.add(blackKnight, gameState.getBlackPlayer().getCol(), gameState.getBlackPlayer().getRow());

        GameState.AddRestricted(gameState.getWhitePlayer().getCurrentLocation());
        GameState.AddRestricted(gameState.getBlackPlayer().getCurrentLocation());

        whiteKnight.setOnMouseClicked(null);
        blackKnight.setOnMouseClicked(this::knigthOnMouseClicked);
        tunLabel.setText(gameState.getPlayer(gameState.getTurnPlayer()).getName() + "'s Turn");

    }

    private void setPaneClickEvent() {
        if (gameState.isWhiteMove()) {
            blackKnight.setOnMouseClicked(null);
            whiteKnight.setOnMouseClicked(this::knigthOnMouseClicked);
            tunLabel.setText(gameState.getWhitePlayer().getName() + "'s Turn");

        } else {
            whiteKnight.setOnMouseClicked(null);
            blackKnight.setOnMouseClicked(this::knigthOnMouseClicked);
            tunLabel.setText(gameState.getBlackPlayer().getName() + "'s Turn");

        }
        gameState.setWhiteMove(!gameState.isWhiteMove());

    }

    @FXML
    private void GiveUpCLicked(ActionEvent e) {
        try {
            showLastScene();
        } catch (IOException ee) {
            log.error("Something bad Happened, Exception is {}", ee.getMessage());
        }
    }

    @FXML
    private void knigthOnMouseClicked(MouseEvent e) {

        clickedKnight = (Knight) e.getSource();

        Object[] moves = ((Player) gameState.getPlayer(clickedKnight.getKnightId())).getMoves().toArray();
        if (moves.length == 0) {
            Player playerWon = gameState.getOther(clickedKnight.getKnightId());
            Player playerLoose = gameState.getPlayer(clickedKnight.getKnightId());
            Alert a = new Alert(Alert.AlertType.INFORMATION, playerWon.getName() + " Won", ButtonType.OK);
            a.showAndWait();
            log.info("Game Finished,Winner is: {}", playerWon.getName());
            try {
                sendDatatoDB(playerWon, playerLoose);
            } catch (Exception x) {
                log.error("Erros in Database, Exception is: {}", x.getMessage());
            }
        }
        for (Object move : moves) {
            ObservableList<Node> childrens = chessBoardView.getChildren();
            for (Node node : childrens) {
                int row_index = (GridPane.getRowIndex(node)) == null ? 0 : GridPane.getRowIndex(node);
                int col_index = (GridPane.getColumnIndex(node)) == null ? 0 : GridPane.getColumnIndex(node);

                if (row_index == ((Point) move).x && col_index == ((Point) move).y) {

                    availablePanesToMove.add((Pane) node);

                    // ((Pane) node).setBackground(Knight.getRestrictedBg());
                    ((Pane) node).setStyle("-fx-background-color: #FFFF00;");

                }
            }
        }

    }

    /**
     * <p>
     * This method is responsible for storing or updating data to database.</p>
     *
     * <p>
     * It will check if the player is already in our database and then deal with
     * player accordingly.</p>
     *
     * <p>
     * It will then show the Summary Scene.</p>
     *
     * @param winningPlayer The winning Player of Game
     * @param loosingPlayer Other Player of Game
     */
    public void sendDatatoDB(Player winningPlayer, Player loosingPlayer) {
        try {
            //Checking if Player exists
            if (((Optional<Player>) playerDao.find(winningPlayer.getName())).isPresent()) {
                winningPlayer.setWinCount(winningPlayer.getWinCount() + 1);
                playerDao.update(winningPlayer.getName(), winningPlayer.getWinCount());
                log.info("Updated Win Count for {} to {} in Database", winningPlayer.getName(), winningPlayer.getWinCount());
            } else {

                playerDao.persist(winningPlayer);
                log.info("Added Winner Player to Database");
            }
            if (((Optional<Player>) playerDao.find(loosingPlayer.getName())).isPresent() == false) {
                playerDao.persist(loosingPlayer);
                log.info("Added Looser Player to Database");

            }
            gameResultDAO.persist(getResult(winningPlayer.getName()));
            log.info("Added Game Result to Database");
        } catch (Exception x) {
            log.error("Database error occured, error is: {}", x.getMessage());
        }
        try {
            showLastScene();
        } catch (IOException ex) {
            log.error("Can't Move Last Scene, error is: {}", ex.getMessage());
        }
    }

    private void showLastScene() throws IOException {
        FXMLLoader loader = new FXMLLoader(MainApp.class.getResource("/fxml/result.fxml"));
        Stage stage = new Stage();
        stage.setScene(new Scene(loader.load()));
        stage.setTitle("Stats");

        stage.setOnCloseRequest(FunctionsLib.confirmCloseEventHandler);
        stage.toFront();
        stage.show();

        ((Stage) giveUpBUtton.getScene().getWindow()).close();
        log.info("Loading Top 5 PLayers.");
    }

    /**
     * <p>
     * This method will create object of {@link GameResult}.</p>
     *
     * @param name name of winner
     * @return {@link GameResult} object
     */
    private GameResult getResult(String name) {
        GameResult result = GameResult.builder()
                .player1(gameState.getPlayer(0).getName())
                .player2(gameState.getPlayer(1).getName())
                .winner(name)
                .build();
        return result;
    }

}
