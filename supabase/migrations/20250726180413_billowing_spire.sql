/*
  # Add document management fields to translation orders

  1. New Columns
    - `original_document_url` (text, URL to original document)
    - `original_document_name` (text, original filename)
    - `translated_document_url` (text, URL to translated document) 
    - `translated_document_name` (text, translated filename)
    - `document_type` (text, file type/extension)
    - `word_count` (integer, estimated word count)
    - `estimated_delivery` (timestamp, estimated completion date)

  2. Security
    - Policies already allow full access for anonymous users
    - No additional RLS policies needed

  3. Notes
    - These fields support document upload/download functionality
    - URLs can point to Supabase storage or external storage
*/

-- Add document management columns
ALTER TABLE solicitudes_traduccion 
ADD COLUMN IF NOT EXISTS original_document_url text,
ADD COLUMN IF NOT EXISTS original_document_name text,
ADD COLUMN IF NOT EXISTS translated_document_url text,
ADD COLUMN IF NOT EXISTS translated_document_name text,
ADD COLUMN IF NOT EXISTS document_type text DEFAULT 'pdf',
ADD COLUMN IF NOT EXISTS word_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_delivery timestamptz;

-- Update sample data with document information
UPDATE solicitudes_traduccion 
SET 
  original_document_name = 'documento_presentacion.pdf',
  document_type = 'pdf',
  word_count = 1250,
  estimated_delivery = fecha_solicitud + interval '5 days'
WHERE nombre = 'María García';

UPDATE solicitudes_traduccion 
SET 
  original_document_name = 'manual_tecnico.docx',
  document_type = 'docx', 
  word_count = 2800,
  estimated_delivery = fecha_solicitud + interval '7 days'
WHERE nombre = 'John Smith';

UPDATE solicitudes_traduccion 
SET 
  original_document_name = 'contrato_comercial.pdf',
  translated_document_name = 'vertrag_commercial.pdf',
  translated_document_url = 'https://example.com/translated_docs/vertrag_commercial.pdf',
  document_type = 'pdf',
  word_count = 1800,
  estimated_delivery = fecha_solicitud + interval '3 days'
WHERE nombre = 'Sophie Dubois';

UPDATE solicitudes_traduccion 
SET 
  original_document_name = 'informe_medico.pdf',
  translated_document_name = 'informe_medico_es.pdf', 
  translated_document_url = 'https://example.com/translated_docs/informe_medico_es.pdf',
  document_type = 'pdf',
  word_count = 950,
  estimated_delivery = fecha_solicitud + interval '2 days'
WHERE nombre = 'Hans Mueller';

UPDATE solicitudes_traduccion 
SET 
  original_document_name = 'estudio_clinico.pdf',
  document_type = 'pdf',
  word_count = 3200,
  estimated_delivery = fecha_solicitud + interval '10 days'
WHERE nombre = 'Lisa Anderson';