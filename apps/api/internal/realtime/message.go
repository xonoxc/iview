package realtime

import "encoding/json"

/*realtime message shape*/
type Message struct {
	Type    string          `json:"type"`
	From    string          `json:"from"`
	To      string          `json:"to"`
	Payload json.RawMessage `json:"payload"`
}

func DecodeMessage(msg []byte) (Message, error) {
	var message Message
	if err := json.Unmarshal(msg, &message); err != nil {
		return Message{}, err
	}
	return message, nil
}

func EncodeMessage(msg Message) ([]byte, error) {
	return json.Marshal(msg)
}
