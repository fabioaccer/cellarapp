/**
 * Logger utilitário para desenvolvimento
 */
export class Logger {
    private static isDevelopment = __DEV__;

    static log(message: string, ...args: any[]): void {
        if (this.isDevelopment) {
            console.log(`[LOG] ${message}`, ...args);
        }
    }

    static warn(message: string, ...args: any[]): void {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    static error(message: string, error?: any): void {
        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, error);
        }
    }

    static info(message: string, ...args: any[]): void {
        if (this.isDevelopment) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }
}
