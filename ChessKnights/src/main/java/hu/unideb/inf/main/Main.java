
package hu.unideb.inf.main;

import javafx.application.Application;

/**
 * <p>Its the main Class of Game.</p>
 *
 * @author ssht
 * @version $Id: $Id
 */
public class Main {
     /**
      * The main() method is ignored in correctly deployed JavaFX application.
      * main() serves only as fallback in case the application can not be
      * launched through deployment artifacts, e.g., in IDEs with limited FX
      * support. NetBeans ignores main().
      *
      * @param args the command line arguments
      */
     public static void main(String[] args) {
        Application.launch(MainApp.class, args);
    }
}
