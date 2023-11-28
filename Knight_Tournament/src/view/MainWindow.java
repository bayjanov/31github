package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class MainWindow extends JFrame {

    public MainWindow(int[] boardSizes) {
        setTitle("Knight Movement Game");
        setSize(400, 350);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel titlePanel = new JPanel();
        JLabel title = new JLabel("Knight Tournalment");
        titlePanel.add(title);
        getContentPane().add(titlePanel, BorderLayout.NORTH);
        titlePanel.setBackground(new Color(56, 63, 65));
        title.setForeground(Color.WHITE);

        JPanel menuPanel = new JPanel();
        menuPanel.setBackground(new Color(56, 63, 65));
        for (int size : boardSizes) {
            JButton button = new JButton(size + " x " + size);
            button.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    GameWindow gameWindow = new GameWindow(size);
                    gameWindow.setVisible(true);
                }
            });
            menuPanel.add(button);
        }
        getContentPane().add(menuPanel, BorderLayout.CENTER);

        setupMenuBar();
    }

    private void setupMenuBar() {
        JMenuBar menuBar = new JMenuBar();
        setJMenuBar(menuBar);

        JMenu menuList = new JMenu("Options");
        menuBar.add(menuList);
        menuBar.setBackground(new Color(207, 208, 208));


        JMenuItem exitMenuItem = new JMenuItem("Exit");
        menuList.add(exitMenuItem);
        exitMenuItem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent ae) {
                System.exit(0);
            }
        });
    }
}
