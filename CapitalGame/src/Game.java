import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.io.File;

public class Game {

    private final List<Field> fields = new ArrayList<>();
    private final List<Player> players = new ArrayList<>();
    private final List<Integer> diceRolls = new ArrayList<>();
    private int currentPlayerPosition = 0;
    private int currentRollIndex = 0;

    // Exception when file does not exist
    class FileNotExistException extends Exception {

        public FileNotExistException(String message) {
            super(message);
        }
    }

// Exception when the file is empty
    class EmptyFileException extends Exception {

        public EmptyFileException(String message) {
            super(message);
        }
    }

// Exception when the input is not as expected
    class InvalidInputException extends Exception {

        public InvalidInputException(String message) {
            super(message);
        }
    }

// Exception when there is not enough data in the file to set up the game
    class InsufficientDataException extends Exception {

        public InsufficientDataException(String message) {
            super(message);
        }
    }

    public Game() {
        try (Scanner userInputScanner = new Scanner(System.in)) {
            System.out.print("Please enter the file name: ");
            String filename = userInputScanner.nextLine();
            File file = new File("C:\\Users\\brian\\OneDrive\\Desktop\\Education\\Sem 5\\Prog technology\\Assignment 1\\2023\\Assignment_1_YUT09Q\\Capital_Game\\CapitalGame\\inputFiles\\" + filename);
            if (!file.exists()) {
                throw new FileNotExistException("The file " + filename + " does not exist.");
            }

            try (Scanner fileScanner = new Scanner(file)) {
                if (!fileScanner.hasNext()) {
                    throw new EmptyFileException("The file is empty.");
                }

                // Read number of fields
                if (!fileScanner.hasNextInt()) {
                    throw new InvalidInputException("Expected a number for the field count.");
                }
                int numFields = fileScanner.nextInt();
                fileScanner.nextLine();

                for (int i = 0; i < numFields; i++) {
                    String typeString = fileScanner.next();
                    
                    FieldType type = FieldType.valueOf(typeString.toUpperCase());
                    int cost = (type == FieldType.PROPERTY) ? 0 : fileScanner.nextInt();
                    fields.add(new Field(type, cost));
                    fileScanner.nextLine();
                }

                // Read number of players
                if (!fileScanner.hasNextInt()) {
                    throw new InvalidInputException("Expected a number for the player count.");
                }
                int numPlayers = fileScanner.nextInt();
                fileScanner.nextLine();

                for (int i = 0; i < numPlayers; i++) {
                    String name = fileScanner.next();
                    String strategyString = fileScanner.next();
                    StrategyType strategy = StrategyType.valueOf(strategyString.toUpperCase());
                    players.add(new Player(name, strategy));
                }

                // Read dice rolls
                while (fileScanner.hasNextInt()) {
                    diceRolls.add(fileScanner.nextInt());
                }

                if (diceRolls.isEmpty()) {
                    throw new InsufficientDataException("No dice roll data found in the file.");
                }

            }
        } catch (FileNotExistException | EmptyFileException | InvalidInputException | InsufficientDataException e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("An unexpected error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }

//
//    public Game() {
//        try (Scanner userInputScanner = new Scanner(System.in)) {
//            System.out.print("Please enter the file name: ");
//            String filename = userInputScanner.nextLine();
//            File file = new File(filename);
//            while (!file.exists()) {
//                System.out.println("The file " + filename + " does not exist.");
//                System.out.print("Please enter a valid file name: ");
//                filename = userInputScanner.nextLine();
//                file = new File(filename);
//            }
//
//            try (Scanner fileScanner = new Scanner(file)) {
//                // Read number of fields
//                int numFields = fileScanner.nextInt();
//                fileScanner.nextLine(); // Consume newline
//                for (int i = 0; i < numFields; i++) {
//                    String typeString = fileScanner.next();
//                    FieldType type = FieldType.valueOf(typeString.toUpperCase());
//                    int cost = (type == FieldType.PROPERTY) ? 0 : fileScanner.nextInt();
//                    fields.add(new Field(type, cost));
//                    fileScanner.nextLine(); // Consume newline
//                }
//
//                // Read number of players
//                int numPlayers = fileScanner.nextInt();
//                fileScanner.nextLine(); // Consume newline
//                for (int i = 0; i < numPlayers; i++) {
//                    String name = fileScanner.next();
//                    String strategyString = fileScanner.next();
//                    StrategyType strategy = StrategyType.valueOf(strategyString.toUpperCase());
//                    players.add(new Player(name, strategy));
//                }
//
//                // Read dice rolls
//                while (fileScanner.hasNextInt()) {
//                    diceRolls.add(fileScanner.nextInt());
//                }
//
//            }
//        } catch (Exception e) {
//            System.out.println("Error: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }
    public void playRound() {
        for (Player player : players) {
            if (currentRollIndex >= diceRolls.size()) {
                System.out.println("Error: No more dice rolls available. Ending game.");
                return;
            }

            int roll = diceRolls.get(currentRollIndex);
            currentRollIndex++;

            currentPlayerPosition += roll;
            currentPlayerPosition %= fields.size();

            Field currentField = fields.get(currentPlayerPosition);
            currentField.stepOn(player);

            if (currentField.getFieldType() == FieldType.PROPERTY && currentField.getOwner() == player && !currentField.hasHouse()) {
                currentField.buildHouse();
            }
        }
    }

    public void displayResults() {
        for (Player player : players) {
            System.out.println(player.getName() + " has a balance of " + player.getBalance() + " and owns " + player.getProperties().size() + " properties.");
        }
    }

    public boolean hasMoreRounds() {
        return currentRollIndex < diceRolls.size();
    }
}
