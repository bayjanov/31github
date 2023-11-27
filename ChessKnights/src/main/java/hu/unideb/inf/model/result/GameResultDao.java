package hu.unideb.inf.model.result;

import hu.unideb.inf.jpa.GenericJpaDao;

import javax.persistence.Persistence;
import java.util.List;
import java.util.Optional;

/**
 * <p>
 * DAO class for the {@link hu.unideb.inf.model.result.GameResult} entity.</p>
 *
 * @author ssht
 * @version $Id: $Id
 */
public class GameResultDao extends GenericJpaDao<GameResult> {

    private static GameResultDao instance;

    private GameResultDao() {
        super(GameResult.class);
    }

    /**
     * <p>
     * Getting Instance of {@link hu.unideb.inf.model.result.GameResultDao}.</p>
     *
     * @return Instance of {@link hu.unideb.inf.model.result.GameResultDao}
     */
    public static GameResultDao getInstance() {
        if (instance == null) {
            instance = new GameResultDao();
            instance.setEntityManager(Persistence.createEntityManagerFactory("persistance-1").createEntityManager());
        }
        return instance;
    }

}
