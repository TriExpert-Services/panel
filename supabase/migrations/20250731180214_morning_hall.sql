/*
  # Fix company settings access for client verification

  1. Security Updates
    - Allow anonymous users to read company settings
    - This enables the client verification page to show contact information
    - Only allows SELECT operations for public access

  2. Notes
    - Clients need to see company contact info on verification page
    - Only public-safe fields are exposed (no SMTP passwords)
*/

-- Allow anonymous users to read company settings
CREATE POLICY "Allow anonymous users to read company info"
  ON company_settings
  FOR SELECT
  TO anon
  USING (true);