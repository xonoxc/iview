package realtime

import "sync"

/**
* In memory container for all our rooms
**/
type Hub struct {
	mu       sync.RWMutex
	sessions map[string]*Session
}

func NewHub() *Hub {
	return &Hub{
		sessions: make(map[string]*Session),
	}
}

func (hub *Hub) SendTo(roomId, clientId string, msg Message) bool {
	hub.mu.RLock()
	defer hub.mu.RUnlock()

	session, exists := hub.sessions[roomId]
	if !exists {
		return false
	}

	return session.SendTo(clientId, msg)
}

func (hub *Hub) Register(client *Client) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	session, exists := hub.sessions[client.RoomId]
	if !exists {
		hub.sessions[client.RoomId] = NewSession(
			client.RoomId,
		)
	}

	session.AddClient(client)
}

func (hub *Hub) Unregister(client *Client) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	session, exists := hub.sessions[client.RoomId]
	if !exists {
		return
	}

	session.RemoveClient(client)

	if session.RoomSize() == 0 {
		delete(hub.sessions, client.RoomId)
	}
}

func (hub *Hub) BroadCast(roomId string, msg Message) {
	hub.mu.RLock()
	defer hub.mu.RUnlock()

	session, exists := hub.sessions[roomId]
	if !exists {
		return
	}
	session.BroadCast(msg)
}
