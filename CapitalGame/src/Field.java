public class Field {
    private final FieldType fieldType;
    private final int cost;
    private Player owner;
    private boolean hasHouse = false;

    public Field(FieldType fieldType, int cost) {
        this.fieldType = fieldType;
        this.cost = cost;
    }

    public void stepOn(Player player) {
        switch (fieldType) {
            case PROPERTY -> {
                if (owner == null) {
                    if (player.wantsToBuy(this)) {
                        player.decreaseBalance(1000);
                        owner = player;
                        player.addOwnedProperty(this);
                    }
                } else if (owner != player) {
                    int charge = hasHouse ? 2000 : 500;
                    player.decreaseBalance(charge);
                    owner.increaseBalance(charge);
                } else if (owner.isInGame() == false) {
                    player.addOwnedProperty(this);
                }
            }
            case SERVICE -> player.decreaseBalance(cost);
            case LUCKY -> player.increaseBalance(cost);
        }
    }

    public void buildHouse() {
        if (owner != null && !hasHouse && owner.getBalance() >= 4000) {
            hasHouse = true;
            owner.decreaseBalance(4000);
        }
    }

    public Player getOwner() {
        return owner;
    }

    public FieldType getFieldType() {
        return fieldType;
    }

    public int getCost() {
        return cost;
    }

    public boolean hasHouse() {
        return hasHouse;
    }
}
