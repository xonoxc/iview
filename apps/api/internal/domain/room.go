package domain

import "time"

type RoomStatus string

const (
	RoomWaiting RoomStatus = "waiting"
	RoomActive  RoomStatus = "active"
	RoomEnded   RoomStatus = "ended"
)

type Room struct {
	ID        string     `json:"id"`
	Status    RoomStatus `json:"status"`
	Title     string     `json:"title"`
	CreatedAt time.Time  `json:"created_at"`
}
