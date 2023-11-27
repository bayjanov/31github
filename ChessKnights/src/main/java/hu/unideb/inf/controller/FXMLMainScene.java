package hu.unideb.inf.controller;

import hu.unideb.inf.main.MainApp;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import lombok.extern.slf4j.Slf4j;
import hu.unideb.inf.FunctionsLibrary.FunctionsLib;
import hu.unideb.inf.model.Data;
import hu.unideb.inf.model.state.GameState;

import java.io.IOException;
import java.util.HashSet;

/**
 * Controller of MainScene.fxml.
 *
 * @author ssht
 * @version $Id: $Id
 */
@Slf4j
public class FXMLMainScene {

    @FXML
    private Label errorLabel;
    @FXML
    private TextField player1nameText;
    @FXML
    private TextField player2nameText;
    @FXML
    private Button startButton;

    /**
     * <p>
     * This Method will check the errors on the Main Page and prompt the
     * Errors.</p>
     *
     * <p>
     * If There isn't any error, it will launch the Game.</p>
     *
     * @param actionEvent the action from Start Game Button
     */
    public void startAction(ActionEvent actionEvent) {
        if (player1nameText.getText().trim().isEmpty() || player2nameText.getText().trim().isEmpty()) {
            errorLabel.setText("* Player Names are required!!");
            log.error("Player Names are not Provided");
        }
        else if(player1nameText.getText().trim().equals(player2nameText.getText().trim())){
            errorLabel.setText("* Player Names can't be same!!");
            log.error("Player Names are same");
        }
         else {
            try {
                FXMLLoader loader = new FXMLLoader(MainApp.class.getResource("/fxml/chess.fxml"));
                Data.setP1(player1nameText.getText().trim());
                Data.setP2(player2nameText.getText().trim());
                Stage stage = new Stage();
                stage.setScene(new Scene(loader.load()));
                stage.setTitle("Main Chess");

                stage.setOnCloseRequest(FunctionsLib.confirmCloseEventHandler);
                stage.toFront();
                stage.show();

                ((Stage) startButton.getScene().getWindow()).close();
                log.info("Game Scene is Loading");
            } catch (IOException x) {
                log.error("Can't Load Scene, Error is: {}", x.getMessage());
            }
            log.info("Player 1 Name is set to {}, loading game scene.", player1nameText.getText());
            log.info("Player 2 Name is set to {}, loading game scene.", player2nameText.getText());
        }

    }
}
