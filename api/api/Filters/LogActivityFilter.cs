using Microsoft.AspNetCore.Mvc.Filters;
using System.Text.Json;

namespace api.Filters
{
    public class LogActivityFilter : IActionFilter
    {
        private readonly ILogger<LogActivityFilter> _logger;

        public LogActivityFilter(ILogger<LogActivityFilter> logger)
        {
            _logger = logger;
        }
        public void OnActionExecuting(ActionExecutingContext context)
        {
            _logger.LogInformation($"executing action {context.ActionDescriptor.DisplayName} on controller  {context.Controller} with arguments : {JsonSerializer.Serialize(context.ActionArguments)}");
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            _logger.LogInformation($"action {context.ActionDescriptor.DisplayName} finished on controlled  {context.Controller} ");
        }
      

    }

}
