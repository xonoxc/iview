-- +goose Up

CREATE TYPE room_status AS ENUM (
    'waiting',
    'active',
    'ended'
);


CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status room_status NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- +goose Down
DROP TABLE IF EXISTS rooms;

DROP TYPE IF EXISTS room_status;
