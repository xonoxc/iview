package realtime

import (
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

const CLIENT_MESSAGES_BUFFER_SIZE = 100

/*
* client is a client belonging to a room
 */
type Client struct {
	Id             string
	RoomId         string
	Connection     *websocket.Conn
	messages       chan Message
	disConnectOnce sync.Once
}

func NewClient(id string, roomId string, conn *websocket.Conn) *Client {
	return &Client{
		Id:         id,
		RoomId:     roomId,
		Connection: conn,
		messages:   make(chan Message, CLIENT_MESSAGES_BUFFER_SIZE),
	}
}

func (c *Client) ReadPump(hub *Hub) {
	msgHanlder := NewMessageHandler(hub)

	for {
		_, msg, err := c.Connection.ReadMessage()
		if err != nil {
			c.Disconnect(hub)
			return
		}

		message, err := DecodeMessage(msg)
		if err != nil {
			continue
		}

		msgHanlder.Handle(c, message)
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
		encodedMsg, err := EncodeMessage(msg)
		if err != nil {
			log.Printf(
				"failed to encode realtime message: %v",
				err,
			)
			return
		}

		err = c.Connection.WriteMessage(websocket.TextMessage, encodedMsg)
		if err != nil {
			c.Disconnect(hub)
			return
		}
	}
}

func (c *Client) Send(msg Message) {
	c.messages <- msg
}
