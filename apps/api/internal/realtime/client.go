package realtime

import (
	"sync"

	"github.com/gorilla/websocket"
)

const CLIENT_MESSAGES_BUFFER_SIZE = 64

/*
* client is a client belonging to a room
 */
type Client struct {
	Id             string
	RoomId         string
	Connection     *websocket.Conn
	messages       chan []byte
	disConnectOnce sync.Once
}

func NewClient(id string, roomId string, conn *websocket.Conn) *Client {
	return &Client{
		Id:         id,
		RoomId:     roomId,
		Connection: conn,
		messages:   make(chan []byte, CLIENT_MESSAGES_BUFFER_SIZE),
	}
}

func (c *Client) ReadPump(hub *Hub) {
	for {
		_, msg, err := c.Connection.ReadMessage()
		if err != nil {
			c.Disconnect(hub)
			return
		}

		hub.BroadCast(c.RoomId, msg)
	}
}

func (c *Client) Disconnect(hub *Hub) {
	c.disConnectOnce.Do(
		func() {
			hub.Unregister(c)
			c.Connection.Close()
			close(c.messages)
		},
	)
}

func (c *Client) WritePump(hub *Hub) {
	for msg := range c.messages {
		err := c.Connection.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			c.Disconnect(hub)
			return
		}
	}
}

func (c *Client) Send(msg []byte) {
	c.messages <- msg
}
