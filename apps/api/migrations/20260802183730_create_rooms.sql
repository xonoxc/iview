-- +goose Up

CREATE TYPE room_status AS ENUM (
    'waiting',
    'active',
    'ended'
);


CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- +goose Down
DROP TABLE IF EXISTS rooms;

DROP TYPE IF EXISTS room_status;
