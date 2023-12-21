using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewPlants
{
    //public enum Radiation { 
    //    Alpha, 
    //    Delta, 
    //    None 
    //}

    public abstract class Radiation
    {
        protected Radiation() { }
        public virtual bool IsAlpha() { return false; }
        public virtual bool IsDelta() { return false; }
        public virtual bool IsNone() { return false; }

    }
    public class None : Radiation
    {
        public override bool IsNone() { return true; }
    }
    public class Alpha : Radiation
    {
        public override bool IsAlpha() { return true; }
    }
    public class Delta : Radiation
    {
        public override bool IsDelta() { return true; }
    }
}
