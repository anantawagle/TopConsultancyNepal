-- Create Enquiries Table
CREATE TABLE enquiries (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    country_interest TEXT,
    study_level TEXT,
    message TEXT,
    source_path TEXT,
    source_type TEXT,
    related_consultancy_id TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    consent INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'new',
    internal_notes TEXT
);

-- Index for querying by status and date
CREATE INDEX idx_enquiries_status_date ON enquiries (status, created_at DESC);

-- Index for searching by email or phone
CREATE INDEX idx_enquiries_email ON enquiries (email);
CREATE INDEX idx_enquiries_phone ON enquiries (phone);
