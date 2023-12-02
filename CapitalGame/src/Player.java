import java.util.ArrayList;

public class Player {

    private final String name;
    private final StrategyType strategy;
    private int balance = 10000;
    private final ArrayList<Field> ownedProperties = new ArrayList<>();
    private boolean skipNext = false;

    public Player(String name, StrategyType strategy) {
        this.name = name;
        this.strategy = strategy;
    }

    public boolean isInGame() {
        return balance > 0;
    }

    public boolean wantsToBuy(Field field) {
        if (isInGame()) {
            switch (strategy) {
                case GREEDY -> {
                    return balance >= 1000;
                }
                case CAREFUL -> {
                    return balance >= 5000;
                }
                case TACTICAL -> {
                    if (skipNext) {
                        skipNext = false;
                        return false;
                    }
                    skipNext = true;
                    return balance >= 1000;
                }
            }

        }
        return false;
    }

    public void decreaseBalance(int amount) {
        balance -= amount;
    }

    public void increaseBalance(int amount) {
        balance += amount;
    }

    public String getName() {
        return name;
    }

    public int getBalance() {
        return balance;
    }

    public ArrayList<Field> getProperties() {
        return ownedProperties;
    }

    public void addOwnedProperty(Field field) {
        ownedProperties.add(field);
    }
}
