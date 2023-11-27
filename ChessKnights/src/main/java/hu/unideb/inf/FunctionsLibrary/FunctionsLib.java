/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hu.unideb.inf.FunctionsLibrary;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import javafx.application.Platform;
import javafx.event.EventHandler;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.stage.WindowEvent;
import lombok.extern.slf4j.Slf4j;

/**
 * <p>
 * Class providing Some useful functions and events.</p>
 *
 * @author ssht
 * @version $Id: $Id
 */
@Slf4j
public class FunctionsLib {

    /**
     * <p>
     * Event to override default Close Event(javafx).
     * </p>
     *
     */
    public static EventHandler<WindowEvent> confirmCloseEventHandler = event -> {
        Alert alert = new Alert(
                Alert.AlertType.CONFIRMATION,
                "Are you sure you want to exit?"
        );
        alert.getButtonTypes().setAll(ButtonType.YES, ButtonType.NO);
        if (!ButtonType.YES.equals(alert.showAndWait().get())) {
            event.consume();
        }
        
    };

}
