/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hu.unideb.inf.model;

import hu.unideb.inf.model.state.GameState;
import java.awt.Point;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

/**
 * <p>PlayerTest class.</p>
 *
 * @author ssht
 * @version $Id: $Id
 * @since 1.0
 */
public class PlayerTest {
    GameState gs = new GameState(new Player("test1", false, 0),new Player("test2", true, 1));

    /**
     * <p>TestPlayerInitialMoves.</p>
     */
    @Test
    public void TestPlayerInitialMoves(){
        assertEquals(gs.getBlackPlayer().getMoves().contains(new Point(2,1)),true);
        assertEquals(gs.getBlackPlayer().getMoves().contains(new Point(1,2)),true);
        MovePlayer(gs.getBlackPlayer());
    }

    private void MovePlayer(Player p) {
        GameState.AddRestricted(p.getCurrentLocation());
        p.setCol(2);
        p.setRow(1);
        gs.advanceTurnPlayer();
    }
    
    /**
     * <p>TestPlayerAfterFirstMoveMoves.</p>
     */
    @Test
    public void TestPlayerAfterFirstMoveMoves(){   
        assertEquals(gs.getBlackPlayer().getMoves().contains(new Point(0,0)),false);
        MovePlayer(gs.getBlackPlayer());
    }
    
}
