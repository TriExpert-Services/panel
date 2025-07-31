/*
  # Create email templates system

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `name` (text, template name)
      - `type` (text, template type: order_created, order_updated, verification_link, etc.)
      - `subject` (text, email subject)
      - `html_content` (text, HTML email content)
      - `text_content` (text, plain text email content)
      - `variables` (text, JSON array of available variables)
      - `is_active` (boolean, whether template is active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `email_templates` table
    - Add policies for authenticated users

  3. Sample Templates
    - Insert default email templates for common scenarios
*/

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('order_created', 'order_updated', 'verification_link', 'order_completed', 'order_delivered')),
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text NOT NULL,
  variables text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(type)
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can manage email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default templates
INSERT INTO email_templates (name, type, subject, html_content, text_content, variables) VALUES
(
  'Orden Creada',
  'order_created',
  'Su orden de traducción ha sido recibida - #{order_id}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orden Recibida</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Orden Recibida!</h1>
            <p>Su solicitud de traducción ha sido procesada exitosamente</p>
        </div>
        <div class="content">
            <p>Estimado/a <strong>#{client_name}</strong>,</p>
            
            <p>Hemos recibido su orden de traducción y está siendo procesada por nuestro equipo de expertos.</p>
            
            <div class="info-box">
                <h3>Detalles de su Orden</h3>
                <p><strong>Número de Orden:</strong> #{order_id}</p>
                <p><strong>Idioma Origen:</strong> #{source_language}</p>
                <p><strong>Idioma Destino:</strong> #{target_language}</p>
                <p><strong>Tiempo Estimado:</strong> #{processing_time} días</p>
                <p><strong>Estado Actual:</strong> #{status}</p>
            </div>
            
            <p>Puede verificar el estado de su traducción en cualquier momento usando el siguiente enlace:</p>
            
            <a href="#{verification_url}" class="button">Ver Estado de Traducción</a>
            
            <p>Nos pondremos en contacto con usted cuando su traducción esté lista.</p>
            
            <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo de Translation Services</strong></p>
        </div>
    </div>
</body>
</html>',
  'Estimado/a #{client_name},

Hemos recibido su orden de traducción y está siendo procesada por nuestro equipo de expertos.

Detalles de su Orden:
- Número de Orden: #{order_id}
- Idioma Origen: #{source_language}
- Idioma Destino: #{target_language}
- Tiempo Estimado: #{processing_time} días
- Estado Actual: #{status}

Puede verificar el estado de su traducción en: #{verification_url}

Nos pondremos en contacto con usted cuando su traducción esté lista.

Saludos cordiales,
Equipo de Translation Services',
  '{"client_name", "order_id", "source_language", "target_language", "processing_time", "status", "verification_url"}'::text[]
),
(
  'Estado Actualizado',
  'order_updated',
  'Actualización de su traducción - #{order_id}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado Actualizado</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .progress-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
        .progress-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; width: #{progress}%; transition: width 0.3s ease; }
        .status-badge { background: #28a745; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Actualización de Estado</h1>
            <p>Su traducción ha progresado</p>
        </div>
        <div class="content">
            <p>Estimado/a <strong>#{client_name}</strong>,</p>
            
            <p>Le informamos que el estado de su orden de traducción ha sido actualizado.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3>Estado Actual</h3>
                <p><span class="status-badge">#{status}</span></p>
                
                <h4>Progreso</h4>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <p style="text-align: center; margin: 10px 0;"><strong>#{progress}% Completado</strong></p>
            </div>
            
            <p>#{status_message}</p>
            
            <a href="#{verification_url}" class="button">Ver Detalles Completos</a>
            
            <p>Gracias por confiar en nuestros servicios.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo de Translation Services</strong></p>
        </div>
    </div>
</body>
</html>',
  'Estimado/a #{client_name},

Le informamos que el estado de su orden de traducción ha sido actualizado.

Estado Actual: #{status}
Progreso: #{progress}% Completado

#{status_message}

Ver detalles completos en: #{verification_url}

Gracias por confiar en nuestros servicios.

Saludos cordiales,
Equipo de Translation Services',
  '{"client_name", "order_id", "status", "progress", "status_message", "verification_url"}'::text[]
),
(
  'Traducción Completada',
  'order_completed',
  '¡Su traducción está lista! - #{order_id}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traducción Completada</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .celebration { text-align: center; font-size: 48px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="celebration">🎉</div>
            <h1>¡Traducción Completada!</h1>
            <p>Su documento está listo para descarga</p>
        </div>
        <div class="content">
            <p>Estimado/a <strong>#{client_name}</strong>,</p>
            
            <p>¡Excelentes noticias! Su traducción ha sido completada y está lista para su descarga.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3>Su Traducción Está Lista</h3>
                <p><strong>Orden:</strong> #{order_id}</p>
                <p><strong>De:</strong> #{source_language} <strong>A:</strong> #{target_language}</p>
                <p><strong>Estado:</strong> Completado ✅</p>
            </div>
            
            <p>Puede descargar sus archivos traducidos haciendo clic en el siguiente enlace:</p>
            
            <a href="#{verification_url}" class="button">Descargar Traducción</a>
            
            <p>Si tiene alguna pregunta sobre su traducción o necesita algún ajuste, no dude en contactarnos.</p>
            
            <p>¡Gracias por elegir nuestros servicios de traducción!</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo de Translation Services</strong></p>
        </div>
    </div>
</body>
</html>',
  'Estimado/a #{client_name},

¡Excelentes noticias! Su traducción ha sido completada y está lista para su descarga.

Detalles:
- Orden: #{order_id}
- De: #{source_language} A: #{target_language}
- Estado: Completado ✅

Puede descargar sus archivos traducidos en: #{verification_url}

Si tiene alguna pregunta sobre su traducción o necesita algún ajuste, no dude en contactarnos.

¡Gracias por elegir nuestros servicios de traducción!

Saludos cordiales,
Equipo de Translation Services',
  '{"client_name", "order_id", "source_language", "target_language", "verification_url"}'::text[]
),
(
  'Enlace de Verificación',
  'verification_link',
  'Enlace de seguimiento para su traducción - #{order_id}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enlace de Verificación</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Seguimiento de Traducción</h1>
            <p>Manténgase informado del progreso</p>
        </div>
        <div class="content">
            <p>Estimado/a <strong>#{client_name}</strong>,</p>
            
            <p>Le enviamos el enlace para que pueda seguir el progreso de su traducción en tiempo real.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                <h3>Información de su Orden</h3>
                <p><strong>Número de Orden:</strong> #{order_id}</p>
                <p><strong>Estado Actual:</strong> #{status}</p>
                <p><strong>Progreso:</strong> #{progress}%</p>
            </div>
            
            <p>Con este enlace podrá:</p>
            <ul>
                <li>Ver el estado actual de su traducción</li>
                <li>Seguir el progreso en tiempo real</li>
                <li>Descargar los archivos cuando estén listos</li>
                <li>Contactar con nuestro equipo si tiene preguntas</li>
            </ul>
            
            <a href="#{verification_url}" class="button">Ver Estado de Traducción</a>
            
            <p>Mantenga este enlace guardado para futuras consultas.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo de Translation Services</strong></p>
        </div>
    </div>
</body>
</html>',
  'Estimado/a #{client_name},

Le enviamos el enlace para que pueda seguir el progreso de su traducción en tiempo real.

Información de su Orden:
- Número de Orden: #{order_id}
- Estado Actual: #{status}
- Progreso: #{progress}%

Con este enlace podrá:
- Ver el estado actual de su traducción
- Seguir el progreso en tiempo real
- Descargar los archivos cuando estén listos
- Contactar con nuestro equipo si tiene preguntas

Ver estado de traducción: #{verification_url}

Mantenga este enlace guardado para futuras consultas.

Saludos cordiales,
Equipo de Translation Services',
  '{"client_name", "order_id", "status", "progress", "verification_url"}'::text[]
);

-- Create trigger to update updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();