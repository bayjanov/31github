/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hu.unideb.inf.model;

import hu.unideb.inf.model.state.GameState;
import static hu.unideb.inf.model.state.GameState.TOTAL_COLS;
import static hu.unideb.inf.model.state.GameState.TOTAL_ROWS;
import java.awt.Point;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * Class representing Player.
 * <p>
 *
 * @author ssht
 * @version $Id: $Id
 */
@Setter
@Getter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Player implements Serializable {

    @Id
    private String name;

    @Column(nullable = false)
    private int winCount;

    @Transient
    private int row;
    @Transient
    private int col;
    @Transient
    private boolean isWhite;
    @Transient
    private int playerId;

    @Column(nullable = false)
    private ZonedDateTime created;

    /**
     * <p>
     * Method for Setting Current Data Time while persisting Data.</p>
     */
    @PrePersist
    protected void onPersist() {
        created = ZonedDateTime.now();
    }

    /**
     * <p>
     * Constructor of Player.</p>
     *
     * <p>
     * It will make new instance of {@link hu.unideb.inf.model.Player} object.</p>
     *
     * @param user1 player name
     * @param isWhite if is player white
     * @param id playerId according to gameState
     */
    public Player(String user1, boolean isWhite, int id) {
        this.name = user1;
        this.isWhite = isWhite;
        this.playerId = id;
        this.winCount = 0;
    }

    /**
     * <p>
     * Method for getting Location of player.</p>
     *
     * @return the current Position of Player on Chess baord
     */
    public Point getCurrentLocation() {
        return new Point(row, col);
    }

    /**
     * <p>
     * Method for getting Available Moves of player.</p>
     *
     * @return possible moves of player
     */
    public Set<Point> getMoves() {
        Set<Point> possibleMoves = new HashSet<>();
        // All possible moves of a knight
        int X[] = {2, 1, -1, -2, -2, -1, 1, 2};
        int Y[] = {1, 2, 2, 1, -1, -2, -2, -1};

        // Check if each possible move is valid or not
        for (int i = 0; i < 8; i++) {

            // Position of knight after move
            int x = this.row + X[i];
            int y = this.col + Y[i];

            // count valid moves
            if (x >= 0 && y >= 0 && x < TOTAL_ROWS && y < TOTAL_COLS
                    && !GameState.getRestrictedSquares().contains(new Point(x, y))) {
                possibleMoves.add(new Point(x, y));
            }

        }
        return possibleMoves;
    }
}
