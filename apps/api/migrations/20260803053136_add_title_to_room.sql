-- +goose Up
ALTER TABLE rooms
ADD COLUMN title VARCHAR(100) NOT NULL DEFAULT 'Untitled Room';

-- +goose Down
ALTER TABLE rooms
DROP COLUMN title;
