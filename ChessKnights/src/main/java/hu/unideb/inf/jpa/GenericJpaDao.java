package hu.unideb.inf.jpa;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;
import javax.persistence.Query;

/**
 * <p>
 * Generic JPA DAO class that provides JPA support for the entity class
 * specified.</p>
 *
 * @param <T> the type of the entity class
 * @author ssht
 * @version $Id: $Id
 */
public abstract class GenericJpaDao<T> {

    protected Class<T> entityClass;
    protected EntityManager entityManager;

    /**
     * <p>
     * Constructs a {@code GenericJpaDao} object.</p>
     *
     * @param entityClass the {@link java.lang.Class} object that represents the entity
     * class
     */
    public GenericJpaDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    /**
     * <p>
     * Returns the underlying {@link javax.persistence.EntityManager} instance.</p>
     *
     * @return the underlying {@link javax.persistence.EntityManager} instance
     */
    public EntityManager getEntityManager() {
        return entityManager;
    }

    /**
     * <p>
     * Sets the underlying {@link javax.persistence.EntityManager} instance.</p>
     *
     * @param entityManager the underlying {@link javax.persistence.EntityManager} instance
     */
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * <p>
     * Persists the specified entity instance in the database.</p>
     *
     * @param entity the entity instance to be persisted in the database
     */
    public void persist(T entity) {
        entityManager.getTransaction().begin();
        entityManager.persist(entity);
        entityManager.getTransaction().commit();
    }

    /**
     * <p>
     * Returns the entity instance with the specified primary key from the
     * database.</p>
     *
     * <p>
     * The method returns an empty {@link java.util.Optional} object when the instance
     * does not exists.</p>
     *
     * @param primaryKey the primary key to look for
     * @return an {@link java.util.Optional} object wrapping the entity instance with the
     * specified primary key
     */
    public Optional<T> find(Object primaryKey) {
        return Optional.ofNullable(entityManager.find(entityClass, primaryKey));
    }

    /**
     * <p>
     * Returns the list of all instances of the entity class from the
     * database.</p>
     *
     * @return the list of all instances of the entity class from the database
     */
    public List<T> findAll() {
        TypedQuery<T> typedQuery = entityManager.createQuery("FROM " + entityClass.getSimpleName(), entityClass);
        return typedQuery.getResultList();
    }

    /**
     * <p>
     * Removes the specified entity instance from the database.</p>
     *
     * @param entity the entity instance to be removed from the database
     */
    public void remove(T entity) {
        entityManager.getTransaction().begin();
        entityManager.remove(entity);
        entityManager.getTransaction().commit();
    }

    /**
     * <p>
     * Updates the specified entity instance in the database.</p>
     *
     * @param entity the entity instance to be updated in the database
     */
    public void update(T entity) {
        entityManager.getTransaction().begin();
        entityManager.merge(entity);
        entityManager.getTransaction().commit();
    }

}
