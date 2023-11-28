import view.MainWindow;

public class App {
    public static void main(String[] args) {
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                MainWindow mainWindow = new MainWindow(new int[]{4, 6, 8});
                mainWindow.setVisible(true);
            }
        });
    }
}
