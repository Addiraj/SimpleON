import { logger } from '../config/logger.js';

export class FinancialDateService {
  private static readonly DEFAULT_TIMEZONE = process.env.BUSINESS_TIMEZONE || 'UTC';

  /**
   * Returns the current business timezone string.
   */
  static getTimezone(): string {
    return process.env.BUSINESS_TIMEZONE || this.DEFAULT_TIMEZONE;
  }

  /**
   * Determines the business date normalized to 00:00:00.000 UTC for database storage.
   * Ensures standard @db.Date compatibility across Prisma transactions.
   *
   * @param date Optional input date (defaults to current time)
   * @param timeZone Optional timezone string override
   */
  static getBusinessDate(date: Date = new Date(), timeZone: string = this.getTimezone()): Date {
    try {
      // Format as YYYY-MM-DD in the target business timezone
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const dateParts = formatter.format(date); // e.g., "2026-07-23"
      const [year, month, day] = dateParts.split('-').map(Number);

      // Construct UTC midnight Date object
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    } catch (err: any) {
      logger.warn({ error: err.message, timeZone }, '[FinancialDateService] Fallback to UTC date');
      const utcDate = new Date(date);
      utcDate.setUTCHours(0, 0, 0, 0);
      return utcDate;
    }
  }

  /**
   * Returns formatted YYYY-MM-DD string representation of business date.
   */
  static getBusinessDateString(date: Date = new Date(), timeZone: string = this.getTimezone()): string {
    const businessDate = this.getBusinessDate(date, timeZone);
    return businessDate.toISOString().split('T')[0];
  }

  /**
   * Calculates UTC start and end bounds for queries spanning a specific business date.
   */
  static getStartAndEndOfBusinessDay(businessDate: Date): { startUtc: Date; endUtc: Date } {
    const startUtc = new Date(businessDate);
    startUtc.setUTCHours(0, 0, 0, 0);

    const endUtc = new Date(businessDate);
    endUtc.setUTCHours(23, 59, 59, 999);

    return { startUtc, endUtc };
  }
}
