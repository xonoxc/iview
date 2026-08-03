package domain

import "time"

type RoomStatus string

const (
	RoomWaiting RoomStatus = "waiting"
	RoomActive  RoomStatus = "active"
	RoomEnded   RoomStatus = "ended"
)

type Room struct {
	ID        string
	Status    RoomStatus
	Title     string
	CreatedAt time.Time
}
