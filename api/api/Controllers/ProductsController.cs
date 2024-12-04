using api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class ProductsController:ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public ProductsController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpPost]
        [Route("")]
        public ActionResult<int> CreateProduct(Product product)
        {
            product.Id = 0;
            _dbContext.Set<Product>().Add(product);
            _dbContext.SaveChanges();

            return Ok(product.Id);
        }


        [HttpPut]
        [Route("")]
        public ActionResult UpdateProduct(Product product)
        {
            var existingProduct = _dbContext.Set<Product>().Find(product.Id);
            if (existingProduct == null)
            {
                return NotFound(); // Handle the case where the product with given Id doesn't exist
            }

            // Update properties
            existingProduct.Name = product.Name;
            existingProduct.Incident = product.Incident;
            existingProduct.Details = product.Details;
            existingProduct.Longitude = product.Longitude;
            existingProduct.Latitude = product.Latitude;

            _dbContext.Set<Product>().Update(existingProduct);
            _dbContext.SaveChanges();
            return Ok();
        }
        [Authorize] // Require authorization for this action
        [HttpDelete]
        [Route("{id}")]
        public ActionResult DeleteProduct(int id)
        {
            // Retrieve the JWT token from the request headers
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            // Validate the token if necessary (e.g., check expiry, validate signature)
            // You need to implement token validation based on your JWT token generation logic

            if (string.IsNullOrEmpty(token))
            {
                // Token not found in headers
                return Unauthorized();
            }

            // Token is present, you can proceed with delete operation
            var existingProduct = _dbContext.Products.Find(id);
            if (existingProduct == null)
            {
                return NotFound(); // Handle the case where the product with the given Id doesn't exist
            }

            _dbContext.Products.Remove(existingProduct);
            _dbContext.SaveChanges();
            return Ok();
        }


        [HttpGet]
        [Route("{id}")]
        public ActionResult GetProductbyid(int id)
        {
            var existingProduct = _dbContext.Set<Product>().Find(id);

            return Ok(existingProduct);
        }
        [HttpGet]
        [Route("")]
        public ActionResult GetAllProducts()
        {
            var existingProduct = _dbContext.Set<Product>();

            return Ok(existingProduct);
        }

        

    }
}

