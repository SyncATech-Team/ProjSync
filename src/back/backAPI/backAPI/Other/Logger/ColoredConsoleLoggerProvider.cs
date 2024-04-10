namespace backAPI.Other.Logger {
    public class ColoredConsoleLoggerProvider : ILoggerProvider {
        public ILogger CreateLogger(string categoryName) {
            return new ColoredConsoleLogger();
        }

        public void Dispose() { }
    }
}
