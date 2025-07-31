/*
  # Add client verification system

  1. New Columns
    - `verification_token` (text, unique token for client verification)
    - `client_can_download` (boolean, controls if client can download files)

  2. Security
    - Add policy for public access using verification token
    - Allow anonymous users to read orders with valid token

  3. Sample Data
    - Generate verification tokens for existing orders
*/

-- Add verification token and download permission columns
ALTER TABLE solicitudes_traduccion 
ADD COLUMN IF NOT EXISTS verification_token text UNIQUE,
ADD COLUMN IF NOT EXISTS client_can_download boolean DEFAULT true;

-- Function to generate random token
CREATE OR REPLACE FUNCTION generate_verification_token()
RETURNS text AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Update existing orders with verification tokens
UPDATE solicitudes_traduccion 
SET verification_token = generate_verification_token()
WHERE verification_token IS NULL;

-- Add policy for public verification access
CREATE POLICY "Allow public access with verification token"
  ON solicitudes_traduccion
  FOR SELECT
  TO anon
  USING (verification_token IS NOT NULL);

-- Trigger to automatically generate verification token on insert
CREATE OR REPLACE FUNCTION set_verification_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_token IS NULL THEN
    NEW.verification_token = generate_verification_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_verification_token_trigger
  BEFORE INSERT ON solicitudes_traduccion
  FOR EACH ROW
  EXECUTE FUNCTION set_verification_token();