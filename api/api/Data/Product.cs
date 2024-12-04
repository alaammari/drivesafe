using System.ComponentModel.DataAnnotations;

namespace api.Data
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Incident { get; set; }
        public string Details { get; set; }
        public double? Latitude { get; set; } // Nullable double
        public double? Longitude { get; set; } // Nullable double
    }

}
