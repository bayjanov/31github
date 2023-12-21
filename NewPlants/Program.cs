using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using TextFile;
using System.IO;
using System.Xml.XPath;
using System.Reflection.PortableExecutable;

namespace NewPlants
{
    class Program
    {
        static void Main()
        {
            try
            {
                // Create simulation instance
                Simulation simulation = new Simulation();

                List<Plant> plants = new List<Plant>();
                Console.Write("Please enter the filename: ");
                string filename = Console.ReadLine();
                

                while (!File.Exists(filename))
                {
                    Console.WriteLine("The file does not exist. Please check the filename and try again.\nEnter 0 to quit.\n\n");
                    Console.Write("Please enter the filename: ");
                    filename = Console.ReadLine();
                    if (filename.ToUpper() == "0")
                    {
                        return;
                    }
                }

                TextFileReader reader = new TextFileReader(filename);

                // populating plants
                reader.ReadLine(out string line);
                int n = int.Parse(line);
                for (int i = 0; i < n; ++i)
                {
                    char[] separators = new char[] { ' ', '\t' };
                    Plant plant = null;

                    if (reader.ReadLine(out line))
                    {
                        try
                        {
                            string[] tokens = line.Split(separators, StringSplitOptions.RemoveEmptyEntries);

                            if (tokens.Length < 3)
                            {
                                Console.WriteLine("There should at least three values in each line: name, type, and nutrients.");
                                continue;
                            }

                            string name = tokens[0];
                            string type = tokens[1];

                            if (!int.TryParse(tokens[2], out int nutirients))
                            {
                                Console.WriteLine($"Could not parse '{tokens[2]}' as an integer.");
                                continue;
                            }

                            switch (type)
                            {
                                case "wom":
                                    plant = new Wombleroot(name, nutirients);
                                    break;
                                case "wit":
                                    plant = new Wittentoot(name, nutirients);
                                    break;
                                case "wor":
                                    plant = new Woreroot(name, nutirients);
                                    break;
                            }

                            if (plant != null)
                            {
                                plants.Add(plant);
                            }
                        }
                        catch (ArgumentOutOfRangeException e)
                        {
                            Console.WriteLine("Exceeded maximum list capacity.");
                            break;
                        }
                    }
                }
                // simulation
                try
                {


                    // read number of days
                    reader.ReadLine(out string dayline);
                    int days = int.Parse(dayline);

                    for (int day = 0; day < days; ++day)
                    {
                        simulation.alphaDemand = 0;
                        simulation.deltaDemand = 0;
                        simulation.AbsorbRadiation(plants, day);
                        simulation.CalculateNextRadiation(plants);
                    }

                    // display results
                    List<Plant> plantsAlive = new List<Plant>();

                    foreach (Plant plant in plants)
                    {
                        if (plant.IsAlive == true )
                        {
                           plantsAlive.Add(plant);
                        }

                    }
                    
                    int max = 0;
                   

                    Plant maxPlant = null;

                    foreach (Plant green in plantsAlive)
                    {
                        if (green.NutrientLevel > max)
                        {
                            max = green.NutrientLevel;
                            maxPlant = green;
                        }
                    }

                    //var sortedPlants = livingPlants.OrderByDescending(p => p.NutrientLevel).ToList();
                    //Plant strongestPlant = sortedPlants.First();

                    if (maxPlant != null)
                    {
                        Console.WriteLine($"\nStrongest plant: {maxPlant.Name}");
                    }
                    else
                    {
                        Console.WriteLine("No plants are alive.");
                    }



                    //Plant strongestPlant = plants.Where(p => p.IsAlive).OrderByDescending(p => p.NutrientLevel).FirstOrDefault();
                    //Console.WriteLine($"\nStrongest plant: {strongestPlant.Name}");
                    //Console.ReadLine();

                }
                catch (FormatException e)
                {
                    Console.WriteLine("Incorrect input format in the file! (Hint: Check the lins of the file)");
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("\n{0}", e.ToString());
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.ReadLine();
                }


            }
            catch (FileNotFoundException e)
            {
                Console.WriteLine("The file was not found: '{0}'\n");
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.ToString());
                Console.ForegroundColor = ConsoleColor.White;
                Console.ReadLine();
            }
            catch (FormatException e)
            {
                Console.WriteLine("Incorrect input format in the file! (Hint: Check the lins of the file)");
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.ToString());
                Console.ForegroundColor = ConsoleColor.White;
                Console.ReadLine();
            }
            catch (ArgumentNullException e)
            {
                Console.WriteLine("An invalid argument is given. File may be empty!\n");
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.ToString());
                Console.ForegroundColor = ConsoleColor.White;
                Console.ReadLine();
            }
            catch (Exception e)
            {
                Console.WriteLine("An error occurred: '{0}'", e);
                Console.ReadLine();
            }
        }
    }
}


