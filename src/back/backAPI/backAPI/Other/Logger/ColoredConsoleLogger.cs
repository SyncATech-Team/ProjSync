namespace backAPI.Other.Logger {
    public class ColoredConsoleLogger : ILogger {

        public IDisposable BeginScope<TState>(TState state) {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel) {
            // Customize log level filtering here if needed
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter) {
            if (formatter != null) {
                var message = formatter(state, exception);
                var color = ConsoleColor.White; // Default color

                switch (logLevel) {
                    case LogLevel.Trace:
                        color = ConsoleColor.Gray;
                        break;
                    case LogLevel.Debug:
                        color = ConsoleColor.Gray;
                        break;
                    case LogLevel.Information:
                        color = ConsoleColor.Green;
                        break;
                    case LogLevel.Warning:
                        color = ConsoleColor.Yellow;
                        break;
                    case LogLevel.Error:
                        color = ConsoleColor.Red;
                        break;
                    case LogLevel.Critical:
                        color = ConsoleColor.DarkRed;
                        break;
                }

                Console.ForegroundColor = color;
                Console.BackgroundColor = ConsoleColor.DarkBlue;
                Console.WriteLine($"[{logLevel}] {message}");
                Console.ResetColor();
            }
        }

    }
}
