/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hu.unideb.inf.model.state;

import hu.unideb.inf.model.Player;
import java.awt.Point;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <p>
 * Class for Representing the Game State.</p>
 *
 * @author ssht
 * @version $Id: $Id
 */
@Setter
@Getter
@NoArgsConstructor
public class GameState {

    private List<Player> players;

    private int numPLayer = 2;

    private int turnPlayer = 0;

    private boolean isWhiteMove;

    /**
     * <p>
     * Constructs the instance of GameState.</p>
     *
     * @param player first player
     * @param player0 second player
     * @param player0 second player
     */
    public GameState(Player player, Player player0) {
        players = new ArrayList<>();
        this.players.add(player);
        this.players.add(player0);
        this.numPLayer = 2;
        this.turnPlayer = 0;
        isWhiteMove = true;

        restrictedSquares = new HashSet<>();
        players.forEach((player1) -> {
            if (player1.isWhite()) {
                player1.setCol(7);
                player1.setRow(7);
            } else {
                player1.setCol(0);
                player1.setRow(0);
            }
        });
    }

    /**
     * <p>
     * Changing the Player's Turn.</p>
     */
    public void advanceTurnPlayer() {

        if (turnPlayer + 1 < numPLayer) {
            turnPlayer++;
        } else {
            turnPlayer = 0;
        }
    }

    /**
     * <p>
     * Total Number of Rows in Chess Board.</p>
     */
    @Getter
    public static final int TOTAL_ROWS = 8;

    /**
     * <p>
     * Total Number of Cols in Chess Board.</p>
     */
    @Getter
    public static final int TOTAL_COLS = 8;

    @Setter(AccessLevel.NONE)
    @Getter
    private static Set<Point> restrictedSquares = new HashSet<>();

    /**
     * <p>
     * Getting the other object of {@link hu.unideb.inf.model.Player} by index.</p>
     *
     * It will return the other player object
     *
     * @param i index of player
     * @return the other object of {@link hu.unideb.inf.model.Player}
     */
    public Player getOther(int i) {
        if (i == 1) {
            return getPlayer(0);
        } else {
            return getPlayer(1);
        }
    }

    /**
     * <p>
     * Getting the {@link hu.unideb.inf.model.Player} object by index.</p>
     *
     * @param i index of object
     * @return the object of {@link hu.unideb.inf.model.Player}
     */
    public Player getPlayer(int i) {
        return this.players.get(i);
    }

    /**
     * <p>
     * Getting the WhitePlayer.</p>
     *
     * @return white player
     */
    public Player getWhitePlayer() {
        return getPlayer(1);
    }

    /**
     * <p>
     * Getting the Black.</p>
     *
     * @return black player
     */
    public Player getBlackPlayer() {
        return getPlayer(0);
    }

    /**
     * <p>
     * Adding Point to Restricted Set.</p>
     *
     * <p>
     * it will add point to the Set of points, the player not allowed to go </p>
     *
     * @param p point which needs to be restricted
     */
    public static void AddRestricted(Point p) {
        restrictedSquares.add(p);
    }

}
