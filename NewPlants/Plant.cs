using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using TextFile;
using System.CodeDom;

namespace NewPlants
{
    public abstract class Plant
    {
        public string Name { get; set; }
        public int NutrientLevel { get; set; }
        public bool HasEverDied { get; protected set; }

        public bool IsAlive => NutrientLevel > 0 && !HasEverDied;

        public Plant(string name, int nutrientLevel)
        {
            Name = name;
            NutrientLevel = nutrientLevel;
            HasEverDied = false;
        }

        public abstract void ReactToRadiation(Radiation radiation);
        public abstract int DemandRadiation();

        public virtual bool IsWombleroot() { return false; }
        public virtual bool IsWittentoot() { return false; }
        public virtual bool IsWoreroot() { return false; }

    }


    public class Wombleroot : Plant
    {
        public Wombleroot(string name, int nutrientLevel) : base(name, nutrientLevel) { }
        public override bool IsWombleroot() { return true; }


        public override void ReactToRadiation(Radiation radiation)
        {
            if (IsAlive)
            {
                
                if (radiation.IsAlpha())
                {
                    NutrientLevel += 2;
                }
                else if (radiation.IsDelta())
                {
                    NutrientLevel -= 2;
                }
                else if (radiation.IsNone())
                {
                    NutrientLevel -= 1;
                }
                
                // A Wombleroot dies if its nutrients go above 10 or drop to 0 or less.
                if (NutrientLevel <= 0 || NutrientLevel > 10)
                {
                    HasEverDied = true;
                }
            } 
            else { return; }
            

        }


        public override int DemandRadiation()
        {
            return IsAlive ? 10 : 0;
        }
    }


    public class Wittentoot : Plant
    {
        public Wittentoot(string name, int nutrientLevel) : base(name, nutrientLevel) { }
        public override bool IsWittentoot() { return true; }
        public override void ReactToRadiation(Radiation radiation)
        {
            if (IsAlive) 
            {
                if (radiation.IsAlpha())
                {
                    NutrientLevel -= 3;
                }
                else if (radiation.IsDelta())
                {
                    NutrientLevel += 4;
                }
                else if (radiation.IsNone())
                {
                    NutrientLevel -= 1;
                }



                if (NutrientLevel <= 0 )
                {
                    HasEverDied = true;
                }
            }
            else { return; }
        }

        public override int DemandRadiation()
        {
                if (NutrientLevel < 5 && IsAlive)
                    return 4;  // demand for delta
                else if (IsAlive  && (NutrientLevel >= 5 && NutrientLevel <= 10))
                    return 1;
                else
                    return 0;
            
        }
    }



    public class Woreroot : Plant
    {
        public Woreroot(string name, int nutrientLevel) : base(name, nutrientLevel) { }
        public override bool IsWoreroot() { return true; }

        public override void ReactToRadiation(Radiation radiation)
        {
            if (IsAlive)
            {
                if (radiation.IsAlpha())
                {
                    NutrientLevel += 1;
                }
                else if (radiation.IsDelta())
                {
                    NutrientLevel += 1;
                }
                else if (radiation.IsNone())
                {
                    NutrientLevel -= 1;
                }



                if (NutrientLevel <= 0)
                {
                    HasEverDied = true;
                }
            }
            else { return; }


        }

        public override int DemandRadiation()
        {
            return 0;
        }
    }
}
