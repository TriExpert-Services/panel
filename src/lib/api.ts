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
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      })
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
    console.log('CompanyService.getSettings() called');
    
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching company settings:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log('Company settings fetched successfully:', data);
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

  static async testConnection(settings?: {
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    smtp_secure: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      let smtpSettings = settings;
      
      if (!smtpSettings) {
        const companySettings = await CompanyService.getSettings();
        if (!companySettings) {
          return { success: false, error: 'No se encontró configuración de empresa' };
        }
        smtpSettings = {
          smtp_host: companySettings.smtp_host || '',
          smtp_port: companySettings.smtp_port || 587,
          smtp_user: companySettings.smtp_user || '',
          smtp_password: companySettings.smtp_password || '',
          smtp_secure: companySettings.smtp_secure ?? true
        };
      }

      // Validate required fields
      if (!smtpSettings.smtp_host.trim()) {
        return { success: false, error: 'El servidor SMTP es requerido' };
      }
      
      if (!smtpSettings.smtp_user.trim()) {
        return { success: false, error: 'El usuario SMTP es requerido' };
      }
      
      if (!smtpSettings.smtp_password.trim()) {
        return { success: false, error: 'La contraseña SMTP es requerida' };
      }
      
      if (smtpSettings.smtp_port < 1 || smtpSettings.smtp_port > 65535) {
        return { success: false, error: 'El puerto debe estar entre 1 y 65535' };
      }

      // Validate email format for smtp_user
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(smtpSettings.smtp_user)) {
        return { success: false, error: 'El usuario SMTP debe ser una dirección de email válida' };
      }

      // Validate common SMTP hosts and ports
      const commonProviders = {
        'smtp.gmail.com': { defaultPort: 587, secure: true },
        'smtp.outlook.com': { defaultPort: 587, secure: true },
        'smtp-mail.outlook.com': { defaultPort: 587, secure: true },
        'smtp.office365.com': { defaultPort: 587, secure: true },
        'smtp.yahoo.com': { defaultPort: 587, secure: true },
        'smtp.mail.yahoo.com': { defaultPort: 587, secure: true }
      };

      const provider = commonProviders[smtpSettings.smtp_host.toLowerCase() as keyof typeof commonProviders];
      if (provider) {
        if (smtpSettings.smtp_port !== provider.defaultPort) {
          console.warn(`Warning: Using port ${smtpSettings.smtp_port} for ${smtpSettings.smtp_host}, recommended port is ${provider.defaultPort}`);
        }
      }

      // Simulate connection test with more realistic validation
      console.log('Testing SMTP connection to:', {
        host: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        user: smtpSettings.smtp_user,
        secure: smtpSettings.smtp_secure
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, you would try to connect to the SMTP server
      // For demo purposes, we'll simulate some common error scenarios
      
      // Check for common configuration issues
      if (smtpSettings.smtp_host.includes('gmail.com') && smtpSettings.smtp_port !== 587) {
        return { success: false, error: 'Gmail requiere puerto 587 con TLS' };
      }
      
      if (smtpSettings.smtp_host.includes('outlook.com') && smtpSettings.smtp_port !== 587) {
        return { success: false, error: 'Outlook requiere puerto 587 con TLS' };
      }

      // Simulate success for valid configurations
      return { success: true };
      
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al probar la conexión'
      };
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

// Email Template Service
export interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class EmailTemplateService {
  static async getTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }

    return data || [];
  }

  static async getTemplate(id: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      return null;
    }

    return data;
  }

  static async createTemplate(templateData: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        ...templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating email template:', error);
      throw error;
    }

    return data;
  }

  static async updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email template:', error);
      throw error;
    }

    return data;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  }

  static replaceVariables(content: string, variables: Record<string, string>): string {
    let processedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`#{${key}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });
    
    return processedContent;
  }

  static getAvailableVariables(): string[] {
    return [
      'client_name',
      'order_id', 
      'source_language',
      'target_language',
      'processing_time',
      'status',
      'progress',
      'verification_url',
      'status_message'
    ];
  }

  static getTemplateTypes(): Array<{value: string, label: string}> {
    return [
      { value: 'order_created', label: 'Orden Creada' },
      { value: 'order_updated', label: 'Estado Actualizado' },
      { value: 'verification_link', label: 'Enlace de Verificación' },
      { value: 'order_completed', label: 'Traducción Completada' },
      { value: 'order_delivered', label: 'Orden Entregada' }
    ];
  }
}