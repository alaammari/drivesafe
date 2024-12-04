using System.ComponentModel;

namespace frontend.Models
{
    public class Products
    {
        public int Id { get; set; }
        [DisplayName("product name")]
        public required string Name { get; set; }
        public required string Sku { get; set; }
    }
}
