using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class ProjetController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
