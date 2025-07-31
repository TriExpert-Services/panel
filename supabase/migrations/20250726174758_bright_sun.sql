/*
  # Create solicitudes_traduccion table for translation orders

  1. New Tables
    - `solicitudes_traduccion`
      - `id` (uuid, primary key)
      - `nombre` (text, client name)
      - `correo` (text, email address)
      - `telefono` (text, phone number)
      - `idioma_origen` (text, source language)
      - `idioma_destino` (text, target language)
      - `status` (text, order status: nuevo, en_proceso, completado, entregado)
      - `priority_level` (text, priority: baja, media, alta, urgente)
      - `progress` (integer, completion percentage)
      - `internal_notes` (text, internal notes for translators)
      - `fecha_solicitud` (timestamp, request date)
      - `created_at` (timestamp, record creation)
      - `updated_at` (timestamp, last update)

  2. Security
    - Enable RLS on `solicitudes_traduccion` table
    - Add policy for authenticated users to manage all data
    - Add policy for anonymous users to read data

  3. Sample Data
    - Insert sample translation orders for testing
*/

CREATE TABLE IF NOT EXISTS solicitudes_traduccion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  correo text NOT NULL,
  telefono text NOT NULL,
  idioma_origen text NOT NULL,
  idioma_destino text NOT NULL,
  status text NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_proceso', 'completado', 'entregado')),
  priority_level text NOT NULL DEFAULT 'media' CHECK (priority_level IN ('baja', 'media', 'alta', 'urgente')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  internal_notes text DEFAULT '',
  fecha_solicitud timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE solicitudes_traduccion ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Allow authenticated users full access"
  ON solicitudes_traduccion
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read data"
  ON solicitudes_traduccion
  FOR SELECT
  TO anon
  USING (true);

-- Insert sample data for testing
INSERT INTO solicitudes_traduccion (nombre, correo, telefono, idioma_origen, idioma_destino, status, priority_level, progress, internal_notes, fecha_solicitud) VALUES
  ('María García', 'maria.garcia@email.com', '+34 666 123 456', 'Español', 'Inglés', 'nuevo', 'alta', 0, 'Cliente solicita entrega urgente para presentación corporativa.', '2024-01-15 10:30:00+00'),
  ('John Smith', 'john.smith@email.com', '+1 555 987 654', 'Inglés', 'Francés', 'en_proceso', 'media', 45, 'Documento técnico con terminología especializada.', '2024-01-14 14:15:00+00'),
  ('Sophie Dubois', 'sophie.dubois@email.com', '+33 1 23 45 67 89', 'Francés', 'Alemán', 'completado', 'baja', 100, 'Traducción completada y revisada por experto nativo.', '2024-01-13 09:20:00+00'),
  ('Hans Mueller', 'hans.mueller@email.com', '+49 30 12345678', 'Alemán', 'Español', 'entregado', 'urgente', 100, 'Entregado al cliente por correo electrónico.', '2024-01-12 16:45:00+00'),
  ('Lisa Anderson', 'lisa.anderson@email.com', '+1 555 123 789', 'Inglés', 'Español', 'en_proceso', 'alta', 75, 'Traducción médica, requiere terminología especializada.', '2024-01-16 11:00:00+00');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_solicitudes_traduccion_updated_at
  BEFORE UPDATE ON solicitudes_traduccion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();