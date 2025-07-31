/*
  # Fix RLS policies for anonymous users

  1. Security Updates
    - Add UPDATE policy for anonymous users on `solicitudes_traduccion` table
    - Allow anonymous users to update all records
    
  2. Notes
    - This allows the application to update orders using the anonymous key
    - In production, you might want to restrict this further based on business rules
*/

-- Drop the existing policy for authenticated users and recreate with broader permissions
DROP POLICY IF EXISTS "Allow authenticated users full access" ON solicitudes_traduccion;

-- Create a comprehensive policy that allows both authenticated and anonymous users full access
CREATE POLICY "Allow full access to translation orders"
  ON solicitudes_traduccion
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure anonymous users can also perform updates
CREATE POLICY "Allow anonymous users to update orders"
  ON solicitudes_traduccion
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);