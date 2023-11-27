package hu.unideb.inf.controller;

import hu.unideb.inf.FunctionsLibrary.FunctionsLib;
import hu.unideb.inf.main.MainApp;
import hu.unideb.inf.model.Player;
import hu.unideb.inf.model.PlayerDao;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * Controller Class for result.fxml.
 * <p>
 *
 * @author ssht
 * @version $Id: $Id
 */
@Slf4j
public class FXMLResult {

    @FXML
    private TableView<Player> toptenTable;

    @FXML
    private TableColumn<Player, String> player;

    @FXML
    private TableColumn<Player, Integer> winCount;

    @FXML
    private TableColumn<Player, ZonedDateTime> created;

    private PlayerDao gameResultDao;

    /**
     * <p>
     * It will call the main Scene Again and close this one.</p>
     *
     * @param actionEvent
     * @throws IOException
     */
@FXML
    private void back(ActionEvent actionEvent) throws IOException {

        FXMLLoader loader = new FXMLLoader(MainApp.class.getResource("/fxml/MainScene.fxml"));
        Stage stage = new Stage();
        stage.setScene(new Scene(loader.load()));
        stage.setTitle("Main Chess");
        stage.centerOnScreen();
        stage.setResizable(false);
        stage.setOnCloseRequest(FunctionsLib.confirmCloseEventHandler);
        stage.toFront();
        stage.show();

        ((Stage) ((Node) actionEvent.getSource()).getScene().getWindow()).close();

        log.info("Loading Main scene.");
    }

    /**
     * <p>
     * It will load Data in TableView from Database.</p>
     */
    @FXML
    public void initialize() {
        gameResultDao = PlayerDao.getInstance();
        List<Player> toptenList = new ArrayList<>();
        try {
            toptenList = gameResultDao.findBest(5);
            log.info("Data from database retrieved");
        } catch (Exception x) {
            log.error("Database Error: {}", x.getMessage());
        }
        toptenTable.setItems(null);
        player.setCellValueFactory(new PropertyValueFactory<>("name"));
        winCount.setCellValueFactory(new PropertyValueFactory<>("winCount"));
        created.setCellValueFactory(new PropertyValueFactory<>("created"));

        created.setCellFactory(column -> {
            TableCell<Player, ZonedDateTime> cell = new TableCell<Player, ZonedDateTime>() {
                private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd - HH:mm:ss Z");

                @Override
                protected void updateItem(ZonedDateTime item, boolean empty) {
                    super.updateItem(item, empty);
                    if (empty) {
                        setText(null);
                    } else {
                        setText(item.format(formatter));
                    }
                }
            };

            return cell;
        });

        ObservableList<Player> observableResult = FXCollections.observableArrayList();
        observableResult.addAll(toptenList);

        toptenTable.setItems(observableResult);
    }

}
