package realtime

import "sync"

/**
* Active room in memory
**/
type Session struct {
	mu      sync.RWMutex
	Id      string
	Clients map[*Client]struct{}
}

func NewSession(roomId string) *Session {
	return &Session{
		Id: roomId,
		Clients: make(
			map[*Client]struct{},
		),
	}
}

func (ses *Session) AddClient(client *Client) {
	ses.mu.Lock()
	defer ses.mu.Unlock()

	ses.Clients[client] = struct{}{}
}

func (ses *Session) RemoveClient(client *Client) {
	ses.mu.Lock()
	defer ses.mu.Unlock()

	delete(ses.Clients, client)
}

func (ses *Session) RoomSize() int {
	ses.mu.RLock()
	defer ses.mu.RUnlock()

	return len(ses.Clients)
}

func (ses *Session) BroadCast(msg []byte) {
	ses.mu.RLock()
	defer ses.mu.RUnlock()

	for client := range ses.Clients {
		client.Send(msg)
	}
}
