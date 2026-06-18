# Data Model: AI Chat Assistant

**Date**: 2026-06-19
**Feature**: AI Chat Assistant

## Entities

### User

Represents an authenticated user who can interact with the AI Chat Assistant.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `email` | `string` | Yes | User email address |
| `firstName` | `string` | Yes | User's first name |
| `lastName` | `string` | Yes | User's last name |
| `role` | `'CUSTOMER' \| 'PROVIDER' \| 'ADMIN'` | Yes | User role in the platform |
| `isActive` | `boolean` | Yes | Account status |
| `createdAt` | `string` (ISO 8601) | Yes | Account creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Yes | Last update timestamp |
| `lastLoginAt` | `string` (ISO 8601) | No | Last login timestamp |

### Conversation

Represents a chat session between a user and the AI assistant.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `userId` | `string` (UUID) | Yes | User who initiated the conversation (FK → users) |
| `title` | `string` | No | Conversation title (auto-generated from first message) |
| `status` | `'ACTIVE' \| 'CLOSED' \| 'ARCHIVED'` | Yes | Conversation state |
| `createdAt` | `string` (ISO 8601) | Yes | Conversation creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Yes | Last update timestamp |
| `lastMessageAt` | `string` (ISO 8601) | No | Timestamp of last message |
| `messageCount` | `number` | No | Total number of messages in conversation |

### ChatMessage

Represents a single message in a conversation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `conversationId` | `string` (UUID) | Yes | Parent conversation (FK → conversations) |
| `senderType` | `'USER' \| 'AI'` | Yes | Message sender |
| `content` | `string` | Yes | Message content |
| `contentType` | `'TEXT' \| 'IMAGE' \| 'FILE'` | Yes | Message content type |
| `metadata` | `Record<string, any>` | No | Additional message metadata |
| `isEdited` | `boolean` | No | Whether message was edited after creation |
| `createdAt` | `string` (ISO 8601) | Yes | Message creation timestamp |
| `updatedAt` | `string` (ISO 8601) | No | Last update timestamp |

### AIRequest

Represents a request sent to the backend AI Gateway.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `conversationId` | `string` (UUID) | Yes | Associated conversation (FK → conversations) |
| `messageId` | `string` (UUID) | Yes | Original user message (FK → chatMessages) |
| `userId` | `string` (UUID) | Yes | User making the request (FK → users) |
| `provider` | `'OPENAI' \| 'GEMINI' \| 'CUSTOM'` | Yes | AI service provider |
| `model` | `string` | Yes | AI model used (e.g., 'gpt-4', 'gemini-pro') |
| `prompt` | `string` | Yes | User's input prompt |
| `context` | `Record<string, any>` | No | Additional context information |
| `tokensUsed` | `number` | No | Number of tokens consumed |
| `processingTime` | `number` | No | Processing time in milliseconds |
| `status` | `'PENDING' \| 'PROCESSING' \| 'COMPLETED' \| 'FAILED'` | Yes | Request status |
| `error` | `string` | No | Error message if request failed |
| `createdAt` | `string` (ISO 8601) | Yes | Request creation timestamp |
| `completedAt` | `string` (ISO 8601) | No | Request completion timestamp |

### AIResponse

Represents the response received from the AI service.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `requestId` | `string` (UUID) | Yes | Associated AI request (FK → aiRequests) |
| `messageId` | `string` (UUID) | Yes | Generated AI message (FK → chatMessages) |
| `content` | `string` | Yes | AI-generated response content |
| `contentType` | `'TEXT' \| 'JSON' \| 'MARKDOWN'` | Yes | Response content type |
| `confidence` | `number` | No | Response confidence score (0-1) |
| `tokensUsed` | `number` | No | Number of tokens generated |
| `processingTime` | `number` | No | Response generation time in milliseconds |
| `streaming` | `boolean` | No | Whether response was streamed |
| `isFallback` | `boolean` | No | Whether response is a fallback |
| `metadata` | `Record<string, any>` | No | Additional response metadata |
| `createdAt` | `string` (ISO 8601) | Yes | Response creation timestamp |

### AiHealthMonitor

Monitors the health and performance of AI services (from backend research).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `service` | `'OPENAI' \| 'GEMINI' \| 'CUSTOM'` | Yes | AI service being monitored |
| `endpoint` | `string` | Yes | API endpoint being tested |
| `status` | `'HEALTHY' \| 'DEGRADED' \| 'UNHEALTHY' \| 'UNKNOWN'` | Yes | Service health status |
| `responseTime` | `number` | No | Average response time in ms |
| `errorRate` | `number` | No | Error rate percentage (0-100) |
| `uptime` | `number` | No | Uptime percentage (0-100) |
| `lastCheck` | `string` (ISO 8601) | Yes | Last health check timestamp |
| `details` | `Record<string, any>` | No | Detailed health metrics |
| `createdAt` | `string` (ISO 8601) | Yes | Health record creation timestamp |
| `updatedAt` | `string` (ISO 8601) | Yes | Last update timestamp |

### AiRequestLog

Logs all AI requests for monitoring and analytics (from backend research).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `requestId` | `string` (UUID) | Yes | Associated AI request (FK → aiRequests) |
| `userId` | `string` (UUID) | Yes | User making the request (FK → users) |
| `service` | `'OPENAI' \| 'GEMINI' \| 'CUSTOM'` | Yes | AI service provider |
| `model` | `string` | Yes | AI model used |
| `prompt` | `string` | No | User's input prompt (truncated for privacy) |
| `response` | `string` | No | AI response (truncated for privacy) |
| `tokensUsed` | `number` | No | Total tokens consumed |
| `processingTime` | `number` | No | Total processing time in ms |
| `cost` | `number` | No | Request cost in USD |
| `status` | `'SUCCESS' \| 'FAILED' \| 'TIMEOUT'` | Yes | Request outcome |
| `error` | `string` | No | Error message if applicable |
| `createdAt` | `string` (ISO 8601) | Yes | Log entry creation timestamp |

## TypeScript Interfaces

```typescript
// Core entities
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface Conversation {
  id: string;
  userId: string;
  title?: string;
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  messageCount?: number;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'USER' | 'AI';
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE';
  metadata?: Record<string, any>;
  isEdited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// AI-related entities
interface AIRequest {
  id: string;
  conversationId: string;
  messageId: string;
  userId: string;
  provider: 'OPENAI' | 'GEMINI' | 'CUSTOM';
  model: string;
  prompt: string;
  context?: Record<string, any>;
  tokensUsed?: number;
  processingTime?: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error?: string;
  createdAt: string;
  completedAt?: string;
}

interface AIResponse {
  id: string;
  requestId: string;
  messageId: string;
  content: string;
  contentType: 'TEXT' | 'JSON' | 'MARKDOWN';
  confidence?: number;
  tokensUsed?: number;
  processingTime?: number;
  streaming?: boolean;
  isFallback?: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Monitoring entities
interface AiHealthMonitor {
  id: string;
  service: 'OPENAI' | 'GEMINI' | 'CUSTOM';
  endpoint: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'UNKNOWN';
  responseTime?: number;
  errorRate?: number;
  uptime?: number;
  lastCheck: string;
  details?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AiRequestLog {
  id: string;
  requestId: string;
  userId: string;
  service: 'OPENAI' | 'GEMINI' | 'CUSTOM';
  model: string;
  prompt?: string;
  response?: string;
  tokensUsed?: number;
  processingTime?: number;
  cost?: number;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  error?: string;
  createdAt: string;
}
```

## Zod Schemas

```typescript
import { z } from 'zod';

// User schema
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().optional(),
});

// Conversation schema
const ConversationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'CLOSED', 'ARCHIVED']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastMessageAt: z.string().datetime().optional(),
  messageCount: z.number().int().min(0).optional(),
});

// ChatMessage schema
const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  senderType: z.enum(['USER', 'AI']),
  content: z.string().min(1).max(10000),
  contentType: z.enum(['TEXT', 'IMAGE', 'FILE']),
  metadata: z.record(z.any()).optional(),
  isEdited: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// AIRequest schema
const AIRequestSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  messageId: z.string().uuid(),
  userId: z.string().uuid(),
  provider: z.enum(['OPENAI', 'GEMINI', 'CUSTOM']),
  model: z.string().min(1),
  prompt: z.string().min(1).max(4000),
  context: z.record(z.any()).optional(),
  tokensUsed: z.number().int().min(0).optional(),
  processingTime: z.number().int().min(0).optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  error: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

// AIResponse schema
const AIResponseSchema = z.object({
  id: z.string().uuid(),
  requestId: z.string().uuid(),
  messageId: z.string().uuid(),
  content: z.string().min(1).max(20000),
  contentType: z.enum(['TEXT', 'JSON', 'MARKDOWN']),
  confidence: z.number().min(0).max(1).optional(),
  tokensUsed: z.number().int().min(0).optional(),
  processingTime: z.number().int().min(0).optional(),
  streaming: z.boolean().default(false),
  isFallback: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
});

// AiHealthMonitor schema
const AiHealthMonitorSchema = z.object({
  id: z.string().uuid(),
  service: z.enum(['OPENAI', 'GEMINI', 'CUSTOM']),
  endpoint: z.string().url(),
  status: z.enum(['HEALTHY', 'DEGRADED', 'UNHEALTHY', 'UNKNOWN']),
  responseTime: z.number().int().min(0).optional(),
  errorRate: z.number().min(0).max(100).optional(),
  uptime: z.number().min(0).max(100).optional(),
  lastCheck: z.string().datetime(),
  details: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// AiRequestLog schema
const AiRequestLogSchema = z.object({
  id: z.string().uuid(),
  requestId: z.string().uuid(),
  userId: z.string().uuid(),
  service: z.enum(['OPENAI', 'GEMINI', 'CUSTOM']),
  model: z.string().min(1),
  prompt: z.string().max(1000).optional(),
  response: z.string().max(1000).optional(),
  tokensUsed: z.number().int().min(0).optional(),
  processingTime: z.number().int().min(0).optional(),
  cost: z.number().min(0).optional(),
  status: z.enum(['SUCCESS', 'FAILED', 'TIMEOUT']),
  error: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
});
```

## Relationships

```
User ||--o{ Conversation : "has"
User ||--o{ AIRequest : "makes"
User ||--o{ AiRequestLog : "creates"

Conversation ||--o{ ChatMessage : "contains"
Conversation ||--o{ AIRequest : "triggers"

ChatMessage ||--o{ AIRequest : "is input for"
ChatMessage ||--o{ AIResponse : "is output for"

AIRequest ||--o{ AIResponse : "generates"
AIRequest ||--o{ AiRequestLog : "is logged as"

AIResponse ||--o{ ChatMessage : "creates"

AiHealthMonitor ||--|{ AiRequestLog : "monitors"
```

## State Transitions

### Conversation States
```
ACTIVE → CLOSED (user ends conversation)
ACTIVE → ARCHIVED (auto-archive after inactivity)
CLOSED → ARCHIVED (admin action)
```

### AI Request States
```
PENDING → PROCESSING (request accepted by AI service)
PROCESSING → COMPLETED (AI response received)
PROCESSING → FAILED (error during processing)
PENDING → FAILED (request rejected or timeout)
```

### Health Monitor States
```
UNKNOWN → HEALTHY (initial check passes)
HEALTHY → DEGRADED (performance issues detected)
DEGRADED → UNHEALTHY (service failure)
UNHEALTHY → HEALTHY (service restored)
```

## Validation Rules

### User Validation
- `email`: Must be valid email format
- `firstName`: 1-50 characters, required
- `lastName`: 1-50 characters, required
- `role`: Must be one of 'CUSTOMER', 'PROVIDER', 'ADMIN'

### Conversation Validation
- `title`: Max 100 characters (auto-generated if not provided)
- `status`: Must be one of 'ACTIVE', 'CLOSED', 'ARCHIVED'
- `userId`: Must reference existing user

### ChatMessage Validation
- `content`: 1-10,000 characters, required
- `contentType`: Must be one of 'TEXT', 'IMAGE', 'FILE'
- `senderType`: Must be one of 'USER', 'AI'
- `conversationId`: Must reference existing conversation

### AIRequest Validation
- `prompt`: 1-4,000 characters, required
- `provider`: Must be one of 'OPENAI', 'GEMINI', 'CUSTOM'
- `model`: Required, must be valid model for selected provider
- `status`: Must be one of 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
- Rate limiting: Max 100 requests per minute per user

### AIResponse Validation
- `content`: 1-20,000 characters, required
- `contentType`: Must be one of 'TEXT', 'JSON', 'MARKDOWN'
- `confidence`: Optional, must be between 0 and 1 if provided

### AiHealthMonitor Validation
- `service`: Must be one of 'OPENAI', 'GEMINI', 'CUSTOM'
- `endpoint`: Must be valid URL
- `status`: Must be one of 'HEALTHY', 'DEGRADED', 'UNHEALTHY', 'UNKNOWN'
- `errorRate`: Optional, must be between 0 and 100 if provided
- `uptime`: Optional, must be between 0 and 100 if provided

### AiRequestLog Validation
- `service`: Must be one of 'OPENAI', 'GEMINI', 'CUSTOM'
- `model`: Required, must be valid model for selected service
- `status`: Must be one of 'SUCCESS', 'FAILED', 'TIMEOUT'
- `prompt`: Max 1,000 characters (truncated for privacy)
- `response`: Max 1,000 characters (truncated for privacy)
- `cost`: Must be non-negative if provided

## Database Schema Considerations

### Indexes
```sql
-- User table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Conversation table
CREATE INDEX idx_conversations_user_id ON conversations(userId);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_created_at ON conversations(createdAt);

-- ChatMessage table
CREATE INDEX idx_messages_conversation_id ON chatMessages(conversationId);
CREATE INDEX idx_messages_sender_type ON chatMessages(senderType);
CREATE INDEX idx_messages_created_at ON chatMessages(createdAt);

-- AIRequest table
CREATE INDEX idx_ai_requests_user_id ON aiRequests(userId);
CREATE INDEX idx_ai_requests_conversation_id ON aiRequests(conversationId);
CREATE INDEX idx_ai_requests_status ON aiRequests(status);
CREATE INDEX idx_ai_requests_created_at ON aiRequests(createdAt);

-- AIResponse table
CREATE INDEX idx_ai_responses_request_id ON aiResponses(requestId);
CREATE INDEX idx_ai_responses_created_at ON aiResponses(createdAt);

-- AiHealthMonitor table
CREATE INDEX idx_ai_health_service ON aiHealthMonitors(service);
CREATE INDEX idx_ai_health_status ON aiHealthMonitors(status);

-- AiRequestLog table
CREATE INDEX idx_ai_logs_user_id ON aiRequestLogs(userId);
CREATE INDEX idx_ai_logs_service ON aiRequestLogs(service);
CREATE INDEX idx_ai_logs_status ON aiRequestLogs(status);
CREATE INDEX idx_ai_logs_created_at ON aiRequestLogs(createdAt);
```

### Foreign Key Constraints
```sql
-- Conversation foreign keys
ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

-- ChatMessage foreign keys
ALTER TABLE chatMessages 
ADD CONSTRAINT fk_messages_conversation 
FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE;

-- AIRequest foreign keys
ALTER TABLE aiRequests 
ADD CONSTRAINT fk_requests_conversation 
FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_requests_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

-- AIResponse foreign keys
ALTER TABLE aiResponses 
ADD CONSTRAINT fk_responses_request 
FOREIGN KEY (requestId) REFERENCES aiRequests(id) ON DELETE CASCADE;

-- AiRequestLog foreign keys
ALTER TABLE aiRequestLogs 
ADD CONSTRAINT fk_logs_request 
FOREIGN KEY (requestId) REFERENCES aiRequests(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_logs_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;
```

### Data Retention Policy
- **ChatMessages**: Keep for 2 years, then archive
- **Conversations**: Keep for 5 years, then soft delete
- **AIRequests**: Keep for 1 year for analytics
- **AIResponses**: Keep for 1 year for analytics
- **AiHealthMonitor**: Keep for 30 days for trending
- **AiRequestLog**: Keep for 1 year for auditing

This comprehensive data model provides a solid foundation for implementing the AI Chat Assistant feature with proper validation, relationships, and database considerations.