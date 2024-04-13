
CREATE TABLE IF NOT EXISTS reports (

    id SERIAL PRIMARY KEY,
    unique_id TEXT,
    suspect_ip TEXT,
    suspect_name TEXT,
    status TEXT,
    created_at TIMESTAMP

)
