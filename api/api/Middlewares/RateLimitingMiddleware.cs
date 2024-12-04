namespace api.Middlewared
{
    public class RateLimitingMiddleware
    {
        private  readonly RequestDelegate _next;

        public RateLimitingMiddleware(RequestDelegate next)

        {
            _next = next;

        }
        public async Task Invoke(HttpContext context)
        {
            await _next(context);
          
        }
    }
}
