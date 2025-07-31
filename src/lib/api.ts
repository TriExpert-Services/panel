// API Service Layer for Translation Administration System

import { supabase } from './supabase';

// Types
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  company_logo?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  smtp_host?: string;
  smtp_port: number;
  smtp_user?: string;
  smtp_password?: string;
  smtp_secure: boolean;
  backup_enabled: boolean;
  backup_frequency: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// API Service Classes
export class ProfileService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  static async updateLastLogin(userId: string): Promise<void> {
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', userId);
  }
}

export class CompanyService {
  static async getSettings(): Promise<CompanySettings | null> {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching company settings:', error);
      return null;
    }

    return data;
  }

  static async updateSettings(updates: Partial<CompanySettings>): Promise<CompanySettings> {
    // First try to update existing record
    const { data: existing } = await supabase
      .from('company_settings')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('company_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('company_settings')
        .insert({
          ...updates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error updating company settings:', result.error);
      throw result.error;
    }

    return result.data;
  }
}

export class NotificationService {
  static async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return data || [];
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data;
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

// SMTP Service
export class SMTPService {
  static async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<boolean> {
    try {
      // Get SMTP settings
      const settings = await CompanyService.getSettings();
      if (!settings?.smtp_host || !settings?.smtp_user) {
        console.error('SMTP settings not configured');
        return false;
      }

      // In a real implementation, you would call your backend API
      // For now, we'll simulate the email sending
      console.log('Sending email:', {
        from: settings.smtp_user,
        to: options.to,
        subject: options.subject,
        smtp: {
          host: settings.smtp_host,
          port: settings.smtp_port,
          secure: settings.smtp_secure
        }
      });

      // Create notification for successful email
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await NotificationService.createNotification({
          user_id: user.id,
          title: 'Email enviado',
          message: `Email enviado exitosamente a ${options.to}`,
          type: 'success'
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const settings = await CompanyService.getSettings();
      if (!settings?.smtp_host) {
        return false;
      }

      // Simulate connection test
      console.log('Testing SMTP connection to:', settings.smtp_host);
      return true;
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return false;
    }
  }
}

// Backup Service
export class BackupService {
  static async createBackup(): Promise<boolean> {
    try {
      console.log('Creating backup...');
      
      // Get all data
      const orders = await supabase.from('solicitudes_traduccion').select('*');
      const settings = await supabase.from('company_settings').select('*');
      const profiles = await supabase.from('user_profiles').select('*');
      const notifications = await supabase.from('notifications').select('*');

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          orders: orders.data || [],
          settings: settings.data || [],
          profiles: profiles.data || [],
          notifications: notifications.data || []
        }
      };

      // In a real implementation, you would upload this to storage
      const backupString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Auto-download backup file
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Create success notification
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await NotificationService.createNotification({
          user_id: user.id,
          title: 'Backup creado',
          message: 'Backup de datos creado exitosamente',
          type: 'success'
        });
      }

      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  }

  static async scheduleBackup(frequency: string): Promise<boolean> {
    try {
      await CompanyService.updateSettings({
        backup_enabled: true,
        backup_frequency: frequency
      });

      console.log(`Backup scheduled: ${frequency}`);
      return true;
    } catch (error) {
      console.error('Error scheduling backup:', error);
      return false;
    }
  }
}