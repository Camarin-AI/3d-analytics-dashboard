
interface LogData {
    level: 'info' | 'warn' | 'error';
    message: string;
    [key: string]: any; // Allow for extra context
  }
  
  const serviceName = 'camarin-analytics-dashboard';
  
  function writeLog(data: LogData) {
    const logObject = {
      service: serviceName,
      timestamp: new Date().toISOString(),
      ...data,
    };
    //TODO: transports to write to files or other services.
    // For Docker/Promtail, console.log is perfect.
    console.log(JSON.stringify(logObject));
  }
  
  const logger = {
    info: (message: string, context: Record<string, any> = {}) => {
      writeLog({ level: 'info', message, ...context });
    },
    warn: (message: string, context: Record<string, any> = {}) => {
      writeLog({ level: 'warn', message, ...context });
    },
    error: (message: string, error: any, context: Record<string, any> = {}) => {
      const errorDetails = error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : { error: JSON.stringify(error) };
  
      writeLog({
        level: 'error',
        message,
        ...errorDetails,
        ...context,
      });
    },
  };
  
  export default logger;