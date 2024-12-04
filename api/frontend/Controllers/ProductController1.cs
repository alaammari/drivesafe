using Microsoft.AspNetCore.Mvc;
using System;

namespace frontend.Controllers
{
    public class ProductController1 : Controller
    {
        Uri baseAddress= new Uri("https://localhost:44333/api")
            private readonly HttpClient _Client;
        public ProductController1()
        {
            _Client = new HttpClient();
            _Client.BaseAddress = baseAddress;
        }
        [HttpGet]
        public IActionResult Index()
        {
            List<Product> products = new List<Product>();
            HttpResponseMessage response = _Client.GetAsync(_Client.BaseAddress + "/product/Get");
            return View();
        }   
    }
}
