package hu.unideb.inf.model;

import hu.unideb.inf.model.result.*;
import hu.unideb.inf.jpa.GenericJpaDao;

import javax.persistence.Persistence;
import java.util.List;
import java.util.Optional;
import javax.persistence.Query;

/**
 * <p>
 * DAO class for the {@link hu.unideb.inf.model.result.GameResult} entity.</p>
 *
 * @author ssht
 * @version $Id: $Id
 */
public class PlayerDao extends GenericJpaDao<Player> {

    private static PlayerDao instance;

    private PlayerDao() {
        super(Player.class);
    }
    /**
     * <p>
     * Returns the instance of  {@link hu.unideb.inf.model.PlayerDao}.</p>
     *
     * <p>It will check if instance is null then create new instance
     * with the help of persistence file.</p>
     *
     * @return the instance of {@link hu.unideb.inf.model.PlayerDao}
     */
    public static PlayerDao getInstance() {
        if (instance == null) {
            instance = new PlayerDao();
            instance.setEntityManager(Persistence.createEntityManagerFactory("persistance-1").createEntityManager());
        }
        return instance;
    }

    /**
     * <p>
     * Returns the list of {@code n} best results with respect to the number of
     * wins.</p>
     *
     * @param n the maximum number of results to be returned
     * @return the list of {@code n} best results with respect to the number of
     * wins
     */
    public List<Player> findBest(int n) {
        List<Player> i= entityManager.createQuery("SELECT r FROM Player r WHERE r.winCount > 0 ORDER BY r.winCount DESC", Player.class)
                .setMaxResults(n)
                .getResultList();
       return i;
       
    }

    /**
     * <p>
     * Update the {@link hu.unideb.inf.model.Player} object's winCount.</p>
     *
     * @param name the name of player to be updated
     * @param winc the new win count of player
     */
    public void update(String name, int winc) {
        entityManager.getTransaction().begin();
        Query setParameter = entityManager.createQuery("UPDATE Player set winCount =:c where name = :name")
                .setParameter("c", winc)
                .setParameter("name", name);
        setParameter.executeUpdate();
        entityManager.getTransaction().commit();
    }

}
