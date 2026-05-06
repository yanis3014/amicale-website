-- Certificats automatiques membres (PDF)
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE SET NULL,
  cotisation_id INT REFERENCES cotisations(id) ON DELETE SET NULL,
  certificate_type VARCHAR(50) NOT NULL CHECK (certificate_type IN ('event_registration', 'cotisation_confirmation')),
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_certificate_source CHECK (
    event_id IS NOT NULL OR cotisation_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_certificates_user_created_at ON certificates(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_type ON certificates(certificate_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_unique_event
  ON certificates(user_id, event_id) WHERE event_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_unique_cotisation
  ON certificates(user_id, cotisation_id) WHERE cotisation_id IS NOT NULL;
