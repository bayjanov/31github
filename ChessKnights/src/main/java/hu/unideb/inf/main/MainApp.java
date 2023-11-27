package hu.unideb.inf.main;

import hu.unideb.inf.FunctionsLibrary.FunctionsLib;
import javafx.application.Application;
import static javafx.application.Application.launch;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import lombok.extern.slf4j.Slf4j;

/**
 * <p>The Class responsible for starting GUI operations.</p>
 *
 * @author ssht
 * @version $Id: $Id
 */
@Slf4j
public class MainApp extends Application {

    private Stage mainStage;

    /**
     * {@inheritDoc}
     *
     * <p>
     * This Method will launch the Main Scene of the Game and will set the
     * attributes.</p>
     */
    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader loader = new FXMLLoader(MainApp.class.getResource("/fxml/MainScene.fxml"));
        Scene scene = new Scene(loader.load());
        this.mainStage = stage;
        stage.setTitle("Chess Knights");
        stage.setResizable(false);
        stage.setOnCloseRequest(FunctionsLib.confirmCloseEventHandler);
        stage.setScene(scene);
        stage.show();
        log.info("Showing the Main Scene of Game");
    }

    

}
