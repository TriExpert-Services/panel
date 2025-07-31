/*
  # Add processing time field to replace priority system

  1. New Columns
    - `tiempo_procesamiento` (integer, processing time in days)

  2. Data Migration
    - Convert existing priority levels to processing time values
    - Update sample data with appropriate processing times

  3. Notes
    - Processing time represents estimated days to complete translation
    - Lower values indicate higher priority (faster processing)
*/

-- Add processing time column
ALTER TABLE solicitudes_traduccion 
ADD COLUMN IF NOT EXISTS tiempo_procesamiento integer DEFAULT 5;

-- Update existing data based on current priority levels
UPDATE solicitudes_traduccion 
SET tiempo_procesamiento = CASE 
  WHEN priority_level = 'urgente' THEN 1
  WHEN priority_level = 'alta' THEN 2
  WHEN priority_level = 'media' THEN 5
  WHEN priority_level = 'baja' THEN 10
  ELSE 5
END;

-- Update sample data with realistic processing times
UPDATE solicitudes_traduccion 
SET tiempo_procesamiento = 1
WHERE nombre = 'María García'; -- Urgent delivery

UPDATE solicitudes_traduccion 
SET tiempo_procesamiento = 7
WHERE nombre = 'John Smith'; -- Standard technical document

UPDATE solicitudes_traduccion 
SET tiempo_procesamiento = 3
WHERE nombre = 'Sophie Dubois'; -- Completed quickly

UPDATE solicitudes_traduccion 
SET tiempo_procesamiento = 2
WHERE nombre = 'Hans Mueller'; -- Was urgent, now delivered

UPDATE solicitudes_traduccion 
SET tiempo_procesamiento = 10
WHERE nombre = 'Lisa Anderson'; -- Complex medical translation