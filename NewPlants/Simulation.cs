using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using TextFile;

namespace NewPlants
{
    public class Simulation
    {
        public int alphaDemand = 0;
        public int deltaDemand = 0;
        private Radiation currentRadiation;

        public Radiation GetCurrentRadiation()
        {
            return currentRadiation;
        }
        public void SettCurrentRadiation(Radiation radiation)
        {
            this.currentRadiation = radiation;
        }

        public Simulation()
        {
            SettCurrentRadiation(new None());
        }

        public void CalculateNextRadiation(List<Plant> plants)
        {

            foreach (Plant green in plants)
            {
                if (green.IsWombleroot())
                {
                    alphaDemand += green.DemandRadiation();
                }
                else if (green.IsWittentoot())
                {
                    deltaDemand += green.DemandRadiation();
                }
                else { }
            }

            // calculate demands difference
            int alphaDifferece = alphaDemand - deltaDemand;
            int deltaDifference = deltaDemand - alphaDemand;

            // set next day's radiation
            Radiation nextRadiation;
            // set next day's radiation
            if (alphaDifferece >= 3)
            {
                nextRadiation = new Alpha();
            }
            else if (deltaDifference >= 3)
            {
                nextRadiation = new Delta();
            }
            else
            {
                nextRadiation = new None();
            }

            // changing today's radiation to next day's
            Console.WriteLine($"  alpha: {alphaDemand},   delta:  {deltaDemand}");

            SettCurrentRadiation(nextRadiation);
        }

        public void AbsorbRadiation(List<Plant> plants, int day)
        {
            foreach (var plant in plants)
            {
                plant.ReactToRadiation(currentRadiation);  // Use ReactToRadiation() method here to start seeing nutirents after Radiaction's affect

                if (plant.IsAlive == false)
                {
                    Console.WriteLine("Day " + (day + 1) + ".  " + plant.Name + " Dead   " + plant.NutrientLevel + $"   alpha: {alphaDemand}, delta: {deltaDemand} " + "   " + currentRadiation);
                    continue;
                }
                else if (plant.IsAlive == true)
                {
                    Console.WriteLine("Day " + (day + 1) + ".  " + plant.Name + "   Alive   " + plant.NutrientLevel + $"  alpha:  {alphaDemand}, delta:  {deltaDemand} " + "    " + currentRadiation);
                }
                //plant.ReactToRadiation(currentRadiation);  // Use ReactToRadiation() method here to start seeing nutirents before Radiaction's affect


            }
            Console.WriteLine("\n");
        }

    }
}