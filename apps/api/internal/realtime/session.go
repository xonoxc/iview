package realtime

import "sync"

/**
* Active room in memory
**/
type Session struct {
	mu      sync.RWMutex
	Id      string
	Clients map[string]*Client
}

func NewSession(roomId string) *Session {
	return &Session{
		Id: roomId,
		Clients: make(
			map[string]*Client,
		),
	}
}

func (ses *Session) SendTo(clientId string, msg Message) bool {
	ses.mu.RLock()
	defer ses.mu.RUnlock()

	client, exists := ses.Clients[clientId]
	if !exists {
		return false
	}
	client.Send(msg)

	return true
}

func (ses *Session) AddClient(client *Client) {
	ses.mu.Lock()
	defer ses.mu.Unlock()

	for _, existing := range ses.Clients {
		existing.Send(Message{
			Type: MessagePresenceJoin,
			From: client.Id,
		})
	}

	ses.Clients[client.Id] = client
}

func (ses *Session) RemoveClient(client *Client) {
	ses.mu.Lock()
	defer ses.mu.Unlock()

	for _, existing := range ses.Clients {
		existing.Send(Message{
			Type: MessagePresenceLeave,
			From: client.Id,
		})
	}

	delete(ses.Clients, client.Id)
}

func (ses *Session) RoomSize() int {
	ses.mu.RLock()
	defer ses.mu.RUnlock()

	return len(ses.Clients)
}

func (ses *Session) BroadCast(msg Message) {
	ses.mu.RLock()
	defer ses.mu.RUnlock()

	for _, client := range ses.Clients {
		client.Send(msg)
	}
}
