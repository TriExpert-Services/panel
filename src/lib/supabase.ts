import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export interface TranslationOrder {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  idioma_origen: string;
  idioma_destino: string;
  status: 'nuevo' | 'en_proceso' | 'completado' | 'entregado';
  tiempo_procesamiento: number;
  progress: number;
  internal_notes: string;
  fecha_solicitud: string;
  created_at: string;
  updated_at: string;
  original_document_url?: string;
  original_document_name?: string;
  archivos_urls?: string[];
  docs_translated?: string[];
  document_type?: string;
  word_count?: number;
  estimated_delivery?: string;
}

// Database service functions
export class TranslationOrderService {
  static async getAll(): Promise<TranslationOrder[]> {
    const { data, error } = await supabase
      .from('solicitudes_traduccion')
      .select('*')
      .order('fecha_solicitud', { ascending: false });

    if (error) {
      console.error('Error fetching translation orders:', error);
      throw error;
    }

    return data || [];
  }

  static async getById(id: string): Promise<TranslationOrder | null> {
    if (!id) {
      throw new Error('ID is required');
    }

    try {
      console.log('=== SUPABASE getById START ===');
      const { data, error } = await supabase
        .from('solicitudes_traduccion')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      console.log('docs_translated raw:', data?.docs_translated);
      console.log('docs_translated type:', typeof data?.docs_translated);
      
      // Parse JSON fields if they come as strings from PostgreSQL
      if (data && typeof data.docs_translated === 'string') {
        try {
          console.log('Parsing docs_translated as JSON string...');
          data.docs_translated = JSON.parse(data.docs_translated);
          console.log('Successfully parsed docs_translated:', data.docs_translated);
        } catch (e) {
          console.log('Could not parse docs_translated as JSON, leaving as string');
        }
      }
      
      // Same for archivos_urls if needed
      if (data && typeof data.archivos_urls === 'string') {
        try {
          console.log('Parsing archivos_urls as JSON string...');
          data.archivos_urls = JSON.parse(data.archivos_urls);
          console.log('Successfully parsed archivos_urls:', data.archivos_urls);
        } catch (e) {
          console.log('Could not parse archivos_urls as JSON, leaving as string');
        }
      }
      
      console.log('Final processed data:', data);
      console.log('=== SUPABASE getById END ===');
      return data;
    } catch (err) {
      console.error('Error in getById:', err);
      throw err;
    }
  }

  static async update(id: string, updates: Partial<TranslationOrder>): Promise<TranslationOrder> {
    try {
      console.log('=== SUPABASE UPDATE START ===');
      console.log('Order ID:', id);
      console.log('Update data:', updates);
      console.log('docs_translated update:', updates.docs_translated);
      console.log('docs_translated type:', typeof updates.docs_translated);
      
      // Ensure docs_translated is properly formatted as array, not JSON string
      if (updates.docs_translated) {
        if (Array.isArray(updates.docs_translated)) {
          console.log('docs_translated is already an array, good');
        } else if (typeof updates.docs_translated === 'string') {
          try {
            const parsed = JSON.parse(updates.docs_translated);
            if (Array.isArray(parsed)) {
              updates.docs_translated = parsed;
              console.log('Converted stringified array back to array:', updates.docs_translated);
            }
          } catch (e) {
            console.log('Could not parse docs_translated as JSON, leaving as is');
          }
        }
      }
      
      const { data, error } = await supabase
        .from('solicitudes_traduccion')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('=== SUPABASE UPDATE ERROR ===', error);
        throw error;
      }

      console.log('=== SUPABASE UPDATE SUCCESS ===');
      console.log('Returned data:', data);
      console.log('Returned docs_translated:', data.docs_translated);
      console.log('Type of returned docs_translated:', typeof data.docs_translated);
      
      return data;
    } catch (err) {
      console.error('=== SUPABASE UPDATE CATCH ERROR ===', err);
      throw err;
    }
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('solicitudes_traduccion')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting translation order:', error);
      throw error;
    }
  }

  static async create(order: Omit<TranslationOrder, 'id' | 'created_at' | 'updated_at'>): Promise<TranslationOrder> {
    const { data, error } = await supabase
      .from('solicitudes_traduccion')
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error('Error creating translation order:', error);
      throw error;
    }

    return data;
  }

  // Upload file to Supabase Storage
  static async uploadTranslatedDocument(file: File, orderId: string): Promise<string> {
    try {
      console.log('Starting file upload for order:', orderId);
      const fileName = `${Date.now()}-${orderId}-${file.name}`;
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from('translated-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      if (!data) {
        throw new Error('No se recibieron datos del archivo subido');
      }

      console.log('File uploaded successfully to storage:', data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('translated-documents')
        .getPublicUrl(filePath);
      
      console.log('Generated public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  }
}