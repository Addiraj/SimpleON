import crypto from 'crypto';
import { prisma, isDatabaseAvailable } from '../config/database.js';
import { AuthRepository, UserRecord } from './AuthRepository.js';
import { logger } from '../config/logger.js';

export interface UserPreferenceRecord {
  id: string;
  user_id: string;
  email_notifications: boolean;
  in_app_notifications: boolean;
  language: string;
  theme: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLogRecord {
  id: string;
  user_id?: string | null;
  admin_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: any;
  new_values?: any;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Date;
}

// In-memory fallback stores
const memoryPreferences = new Map<string, UserPreferenceRecord>();
const memoryAuditLogs: AuditLogRecord[] = [];

export class UserRepository {
  /**
   * Find user by ID or Wallet Address
   */
  static async findUser(userIdOrAddress: string): Promise<UserRecord | null> {
    if (!userIdOrAddress) return null;
    let user = await AuthRepository.findUserById(userIdOrAddress);
    if (!user) {
      user = await AuthRepository.findUserByWalletAddress(userIdOrAddress);
    }
    return user;
  }

  /**
   * Update User Profile (displayName, email)
   */
  static async updateProfile(
    userId: string,
    data: { displayName?: string; email?: string },
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserRecord> {
    const currentUser = await this.findUser(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const oldValues = {
      display_name: currentUser.display_name,
      email: currentUser.email,
    };

    const newDisplayName = data.displayName !== undefined ? data.displayName : currentUser.display_name;
    const newEmail = data.email !== undefined ? data.email : currentUser.email;

    const newValues = {
      display_name: newDisplayName,
      email: newEmail,
    };

    let updatedUser: UserRecord;

    try {
      if (!(await isDatabaseAvailable())) throw new Error('Database offline');
      const dbUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          display_name: newDisplayName,
          email: newEmail,
        },
      });
      updatedUser = dbUser as unknown as UserRecord;
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Prisma unavailable, updating profile in memory store');
      currentUser.display_name = newDisplayName;
      currentUser.email = newEmail;
      currentUser.updated_at = new Date();
      updatedUser = currentUser;
    }

    // Write Audit Log
    await this.createAuditLog({
      userId: currentUser.id,
      action: 'UPDATE_PROFILE',
      entityType: 'USER',
      entityId: currentUser.id,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });

    return updatedUser;
  }

  /**
   * Get User Preferences (creates default if missing)
   */
  static async getPreferences(userId: string): Promise<UserPreferenceRecord> {
    try {
      if (!(await isDatabaseAvailable())) throw new Error('Database offline');
      let prefs = await prisma.userPreference.findUnique({
        where: { user_id: userId },
      });

      if (!prefs) {
        prefs = await prisma.userPreference.create({
          data: {
            user_id: userId,
            email_notifications: true,
            in_app_notifications: true,
            language: 'en',
            theme: 'dark',
          },
        });
      }
      return prefs as unknown as UserPreferenceRecord;
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Prisma unavailable, using in-memory UserPreference');
      let prefs = memoryPreferences.get(userId);
      if (!prefs) {
        prefs = {
          id: crypto.randomUUID(),
          user_id: userId,
          email_notifications: true,
          in_app_notifications: true,
          language: 'en',
          theme: 'dark',
          created_at: new Date(),
          updated_at: new Date(),
        };
        memoryPreferences.set(userId, prefs);
      }
      return prefs;
    }
  }

  /**
   * Update User Preferences
   */
  static async updatePreferences(
    userId: string,
    data: {
      emailNotifications?: boolean;
      inAppNotifications?: boolean;
      language?: string;
      theme?: string;
    },
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserPreferenceRecord> {
    const currentPrefs = await this.getPreferences(userId);

    const oldValues = { ...currentPrefs };

    const emailNotifs = data.emailNotifications !== undefined ? data.emailNotifications : currentPrefs.email_notifications;
    const inAppNotifs = data.inAppNotifications !== undefined ? data.inAppNotifications : currentPrefs.in_app_notifications;
    const lang = data.language !== undefined ? data.language : currentPrefs.language;
    const themeVal = data.theme !== undefined ? data.theme : currentPrefs.theme;

    const newValues = {
      email_notifications: emailNotifs,
      in_app_notifications: inAppNotifs,
      language: lang,
      theme: themeVal,
    };

    let updatedPrefs: UserPreferenceRecord;

    try {
      if (!(await isDatabaseAvailable())) throw new Error('Database offline');
      const dbPrefs = await prisma.userPreference.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          email_notifications: emailNotifs,
          in_app_notifications: inAppNotifs,
          language: lang,
          theme: themeVal,
        },
        update: {
          email_notifications: emailNotifs,
          in_app_notifications: inAppNotifs,
          language: lang,
          theme: themeVal,
        },
      });
      updatedPrefs = dbPrefs as unknown as UserPreferenceRecord;
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Prisma unavailable, updating preferences in memory store');
      currentPrefs.email_notifications = emailNotifs;
      currentPrefs.in_app_notifications = inAppNotifs;
      currentPrefs.language = lang;
      currentPrefs.theme = themeVal;
      currentPrefs.updated_at = new Date();
      memoryPreferences.set(userId, currentPrefs);
      updatedPrefs = currentPrefs;
    }

    // Write Audit Log
    await this.createAuditLog({
      userId,
      action: 'UPDATE_PREFERENCES',
      entityType: 'USER_PREFERENCE',
      entityId: updatedPrefs.id,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });

    return updatedPrefs;
  }

  /**
   * Create an Audit Log Entry
   */
  static async createAuditLog(data: {
    userId?: string;
    adminUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogRecord> {
    const record: AuditLogRecord = {
      id: crypto.randomUUID(),
      user_id: data.userId || null,
      admin_user_id: data.adminUserId || null,
      action: data.action,
      entity_type: data.entityType,
      entity_id: data.entityId || null,
      old_values: data.oldValues || null,
      new_values: data.newValues || null,
      ip_address: data.ipAddress || null,
      user_agent: data.userAgent || null,
      created_at: new Date(),
    };

    try {
      if (!(await isDatabaseAvailable())) throw new Error('Database offline');
      await prisma.auditLog.create({
        data: {
          id: record.id,
          user_id: record.user_id,
          admin_user_id: record.admin_user_id,
          action: record.action,
          entity_type: record.entity_type,
          entity_id: record.entity_id,
          old_values: record.old_values ? JSON.parse(JSON.stringify(record.old_values)) : undefined,
          new_values: record.new_values ? JSON.parse(JSON.stringify(record.new_values)) : undefined,
          ip_address: record.ip_address,
          user_agent: record.user_agent,
        },
      });
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Prisma unavailable, saving audit log to memory');
      memoryAuditLogs.unshift(record);
    }

    return record;
  }

  /**
   * Get user audit logs
   */
  static async getUserAuditLogs(userId: string): Promise<AuditLogRecord[]> {
    try {
      if (!(await isDatabaseAvailable())) throw new Error('Database offline');
      const logs = await prisma.auditLog.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 20,
      });
      return logs as unknown as AuditLogRecord[];
    } catch (err: any) {
      return memoryAuditLogs.filter((l) => l.user_id === userId);
    }
  }

  static resetMemoryStore(): void {
    memoryPreferences.clear();
    memoryAuditLogs.length = 0;
  }
}

export default UserRepository;
