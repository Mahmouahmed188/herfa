# AI Chat Assistant WebSocket Events

**Date**: 2026-06-19
**Feature**: AI Chat Assistant

## WebSocket Connection

### Connection URL
```
ws://api.herfa.sa/api/v1/ai/chat
```

### Connection Parameters
Connect with query parameters:
```
?token=<jwt_token>
&userId=<user_id>
&version=1.0
```

### Connection Lifecycle
1. **Connection Request**: Client connects with authentication token
2. **Authentication**: Server validates token and responds with connection status
3. **Connected**: Client can send and receive messages
4. **Disconnection**: Client can disconnect or server can close connection

## WebSocket Event Types

### 1. Connection Events

#### Connection Established
```json
{
  "type": "connection.established",
  "payload": {
    "connectionId": "uuid",
    "userId": "uuid",
    "timestamp": "2026-06-19T12:00:00Z",
    "features": [
      "chat",
      "typing_indicators",
      "message_status"
    ]
  }
}
```

#### Connection Closed
```json
{
  "type": "connection.closed",
  "payload": {
    "connectionId": "uuid",
    "reason": "USER_DISCONNECTED" | "SERVER_SHUTDOWN" | "AUTH_FAILED",
    "timestamp": "2026-06-19T12:30:00Z",
    "reconnect": true
  }
}
```

### 2. Chat Events

#### Send Message
```json
{
  "type": "chat.message.send",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "content": "Hello, I need help with my booking",
    "contentType": "TEXT",
    "timestamp": "2026-06-19T12:00:00Z",
    "metadata": {
      "clientTimestamp": "2026-06-19T12:00:00Z"
    }
  }
}
```

#### Message Received
```json
{
  "type": "chat.message.received",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "senderType": "AI",
    "content": "Hello! I'd be happy to help you with your booking. What specific service do you need?",
    "contentType": "TEXT",
    "timestamp": "2026-06-19T12:00:30Z",
    "metadata": {
      "confidence": 0.95,
      "tokensUsed": 25,
      "processingTime": 1200
    }
  }
}
```

#### Message Status Update
```json
{
  "type": "chat.message.status",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "status": "DELIVERED" | "READ" | "FAILED",
    "timestamp": "2026-06-19T12:00:35Z",
    "error": "string" // only if status is FAILED
  }
}
```

### 3. Typing Events

#### User Started Typing
```json
{
  "type": "chat.typing.start",
  "payload": {
    "conversationId": "uuid",
    "senderType": "USER",
    "timestamp": "2026-06-19T12:01:00Z"
  }
}
```

#### User Stopped Typing
```json
{
  "type": "chat.typing.stop",
  "payload": {
    "conversationId": "uuid",
    "senderType": "USER",
    "timestamp": "2026-06-19T12:01:30Z"
  }
}
```

#### AI Started Typing
```json
{
  "type": "chat.typing.start",
  "payload": {
    "conversationId": "uuid",
    "senderType": "AI",
    "timestamp": "2026-06-19T12:02:00Z"
  }
}
```

#### AI Stopped Typing
```json
{
  "type": "chat.typing.stop",
  "payload": {
    "conversationId": "uuid",
    "senderType": "AI",
    "timestamp": "2026-06-19T12:02:45Z"
  }
}
```

### 4. Streaming Events

#### Stream Start
```json
{
  "type": "chat.stream.start",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "timestamp": "2026-06-19T12:03:00Z"
  }
}
```

#### Stream Chunk
```json
{
  "type": "chat.stream.chunk",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "content": "Hello",
    "partial": true,
    "timestamp": "2026-06-19T12:03:01Z"
  }
}
```

#### Stream Chunk (Final)
```json
{
  "type": "chat.stream.chunk",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "content": "Hello! How can I help you today?",
    "partial": false,
    "timestamp": "2026-06-19T12:03:15Z",
    "metadata": {
      "confidence": 0.95,
      "tokensUsed": 150,
      "processingTime": 15000
    }
  }
}
```

#### Stream End
```json
{
  "type": "chat.stream.end",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "timestamp": "2026-06-19T12:03:15Z"
  }
}
```

### 5. Conversation Events

#### Conversation Created
```json
{
  "type": "conversation.created",
  "payload": {
    "conversationId": "uuid",
    "userId": "uuid",
    "title": "Booking Inquiry",
    "status": "ACTIVE",
    "createdAt": "2026-06-19T12:00:00Z"
  }
}
```

#### Conversation Updated
```json
{
  "type": "conversation.updated",
  "payload": {
    "conversationId": "uuid",
    "updates": {
      "status": "CLOSED",
      "updatedAt": "2026-06-19T12:30:00Z"
    }
  }
}
```

### 6. Error Events

#### Authentication Error
```json
{
  "type": "error.authentication",
  "payload": {
    "code": "INVALID_TOKEN",
    "message": "Invalid authentication token",
    "timestamp": "2026-06-19T12:00:00Z",
    "action": "RECONNECT"
  }
}
```

#### Rate Limit Error
```json
{
  "type": "error.rate_limit",
  "payload": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "timestamp": "2026-06-19T12:00:00Z",
    "retryAfter": 60,
    "action": "WAIT"
  }
}
```

#### Service Error
```json
{
  "type": "error.service",
  "payload": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "AI service temporarily unavailable",
    "timestamp": "2026-06-19T12:00:00Z",
    "action": "FALLBACK"
  }
}
```

#### Connection Error
```json
{
  "type": "error.connection",
  "payload": {
    "code": "CONNECTION_LOST",
    "message": "Connection lost",
    "timestamp": "2026-06-19T12:00:00Z",
    "action": "RECONNECT",
    "retryCount": 3,
    "maxRetries": 5
  }
}
```

## WebSocket Event Flow Examples

### Typical Chat Flow
```json
// 1. User starts typing
{
  "type": "chat.typing.start",
  "payload": {
    "conversationId": "uuid",
    "senderType": "USER",
    "timestamp": "2026-06-19T12:01:00Z"
  }
}

// 2. User sends message
{
  "type": "chat.message.send",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "content": "Hello, I need help",
    "contentType": "TEXT",
    "timestamp": "2026-06-19T12:01:30Z"
  }
}

// 3. AI starts typing
{
  "type": "chat.typing.start",
  "payload": {
    "conversationId": "uuid",
    "senderType": "AI",
    "timestamp": "2026-06-19T12:01:35Z"
  }
}

// 4. Stream starts
{
  "type": "chat.stream.start",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "timestamp": "2026-06-19T12:01:40Z"
  }
}

// 5. Stream chunks
{
  "type": "chat.stream.chunk",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "content": "Hello",
    "partial": true,
    "timestamp": "2026-06-19T12:01:41Z"
  }
}

{
  "type": "chat.stream.chunk",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "content": "Hello! How can I help you today?",
    "partial": false,
    "timestamp": "2026-06-19T12:01:50Z"
  }
}

// 6. Stream ends
{
  "type": "chat.stream.end",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "timestamp": "2026-06-19T12:01:50Z"
  }
}

// 7. AI stops typing
{
  "type": "chat.typing.stop",
  "payload": {
    "conversationId": "uuid",
    "senderType": "AI",
    "timestamp": "2026-06-19T12:01:55Z"
  }
}
```

### Error Handling Flow
```json
// 1. Connection lost
{
  "type": "error.connection",
  "payload": {
    "code": "CONNECTION_LOST",
    "message": "Connection lost",
    "timestamp": "2026-06-19T12:02:00Z",
    "action": "RECONNECT",
    "retryCount": 1,
    "maxRetries": 5
  }
}

// 2. Reconnection attempt
{
  "type": "connection.established",
  "payload": {
    "connectionId": "uuid",
    "userId": "uuid",
    "timestamp": "2026-06-19T12:02:05Z",
    "features": [
      "chat",
      "typing_indicators",
      "message_status"
    ]
  }
}
```

## WebSocket Client Implementation

### Connection Management
```typescript
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(private url: string, private token: string) {}

  connect() {
    const wsUrl = `${this.url}?token=${this.token}`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('connection.established');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.emit(message.type, message.payload);
    };

    this.ws.onclose = () => {
      this.emit('connection.closed', {
        reason: 'CONNECTION_LOST',
        reconnect: this.reconnectAttempts < this.maxReconnectAttempts
      });
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
      }
    };

    this.ws.onerror = (error) => {
      this.emit('error.connection', { error: error.message });
    };
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(event: string, payload?: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }
}
```

### Message Handling
```typescript
class ChatWebSocket {
  private wsManager: WebSocketManager;

  constructor(token: string) {
    this.wsManager = new WebSocketManager('ws://api.herfa.sa/api/v1/ai/chat', token);
    
    this.wsManager.on('connection.established', this.handleConnectionEstablished);
    this.wsManager.on('chat.message.received', this.handleMessageReceived);
    this.wsManager.on('chat.typing.start', this.handleTypingStart);
    this.wsManager.on('chat.typing.stop', this.handleTypingStop);
    this.wsManager.on('error.connection', this.handleError);
  }

  sendMessage(conversationId: string, content: string) {
    this.wsManager.send('chat.message.send', {
      messageId: generateUUID(),
      conversationId,
      content,
      contentType: 'TEXT',
      timestamp: new Date().toISOString()
    });
  }

  startTyping(conversationId: string) {
    this.wsManager.send('chat.typing.start', {
      conversationId,
      senderType: 'USER',
      timestamp: new Date().toISOString()
    });
  }

  stopTyping(conversationId: string) {
    this.wsManager.send('chat.typing.stop', {
      conversationId,
      senderType: 'USER',
      timestamp: new Date().toISOString()
    });
  }
}
```

These WebSocket event contracts provide a comprehensive foundation for real-time communication in the AI Chat Assistant feature, supporting all necessary interactions with proper error handling and connection management.