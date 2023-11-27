package hu.unideb.inf.model.state;

import hu.unideb.inf.model.Data;
import hu.unideb.inf.model.Player;
import hu.unideb.inf.model.Player;
import hu.unideb.inf.model.state.GameState;
import java.awt.Point;
import static org.junit.Assert.assertEquals;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * <p>GameStateTest class.</p>
 *
 * @author ssht
 * @version $Id: $Id
 * @since 1.0
 */
public class GameStateTest {

    GameState gs = new GameState(new Player("test1", false, 0),new Player("test2", true, 1));
        
   

    /**
     * <p>testGameStateIsBoardStandardDimensions.</p>
     */
    @Test
    public void testGameStateIsBoardStandardDimensions() {
        assertEquals(GameState.TOTAL_ROWS, 8);
        assertEquals(GameState.TOTAL_COLS, 8);
    }
    
    /**
     * <p>testGameStateCheckColorWhite.</p>
     */
    @Test
    public void testGameStateCheckColorWhite(){
        assertEquals(gs.getWhitePlayer().isWhite(), true);
    }
    
    /**
     * <p>testGameStateCheckColorBlack.</p>
     */
    @Test
    public void testGameStateCheckColorBlack(){
        assertEquals(gs.getBlackPlayer().isWhite(), false);
    }
    /**
     * <p>testGameStateIntialPlayerPositionBlack.</p>
     */
    @Test
    public void testGameStateIntialPlayerPositionBlack(){
        assertEquals(gs.getBlackPlayer().getCurrentLocation(), new Point(0,0));
        
    }
     /**
      * <p>testGameStateIntialPlayerPositionWhite.</p>
      */
     @Test
    public void testGameStateIntialPlayerPositionWhite(){
        assertEquals(gs.getWhitePlayer().getCurrentLocation(), new Point(7,7));
        
    }
     /**
      * <p>testGameStateIntialPlayerTurn.</p>
      */
     @Test
    public void testGameStateIntialPlayerTurn(){
        assertEquals(gs.getTurnPlayer(), 0);
        
    }
     /**
      * <p>testGameStateNumPLayer.</p>
      */
     @Test
    public void testGameStateNumPLayer(){
        assertEquals(gs.getNumPLayer(), 2);
        gs.getBlackPlayer().setRow(2);
        gs.getBlackPlayer().setCol(1);
         gs.advanceTurnPlayer();
        
    }
    
}
