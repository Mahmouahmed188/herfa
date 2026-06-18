# AI Chat Assistant Interface Contracts

**Date**: 2026-06-19
**Feature**: AI Chat Assistant

## Overview

This document defines the interface contracts for the AI Chat Assistant feature. The AI Chat Assistant exposes several interfaces to users and other systems through REST API endpoints and WebSocket events.

## REST API Contracts

### Base URL
```
https://api.herfa.sa/api/v1
```

### Authentication
All AI endpoints require JWT Bearer Token authentication:
```
Authorization: Bearer <jwt_token>
```

### Rate Limiting
- **Chat endpoints**: 100 requests per minute per user
- **Analysis endpoints**: 10 requests per minute per user
- **Global limit**: 1000 requests per minute total

## 1. Chat Interface

#### Send Chat Message
```
POST /ai/chat
```

**Request Body:**
```json
{
  "message": "string",
  "conversationId": "uuid",
  "context": {
    "bookingId": "uuid",
    "serviceType": "string",
    "previousMessages": [
      {
        "role": "user" | "assistant",
        "content": "string",
        "timestamp": "string"
      }
    ]
  }
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "reply": "string",
    "confidence": 0.95,
    "processingTime": 1200,
    "tokensUsed": 150,
    "streaming": false,
    "isFallback": false
  }
}
```

#### Stream Chat Message
```
POST /ai/chat/stream
```

**Request Body:**
```json
{
  "message": "string",
  "conversationId": "uuid",
  "context": {
    "bookingId": "uuid",
    "serviceType": "string"
  }
}
```

**Response Body (Server-Sent Events):**
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

data: {"type": "start", "messageId": "uuid", "conversationId": "uuid"}

data: {"type": "content", "content": "Hello", "partial": true}

data: {"type": "content", "content": "Hello! How can I help you today?", "partial": false}

data: {"type": "end", "confidence": 0.95, "tokensUsed": 150, "processingTime": 1200}
```

#### Get Conversation History
```
GET /ai/conversations
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: 'ACTIVE' | 'CLOSED' | 'ARCHIVED' (optional)

**Response Body:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "title": "Booking Inquiry",
        "status": "ACTIVE",
        "messageCount": 5,
        "lastMessageAt": "2026-06-19T12:00:00Z",
        "createdAt": "2026-06-19T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

#### Get Conversation Details
```
GET /ai/conversations/{conversationId}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "userId": "uuid",
      "title": "Booking Inquiry",
      "status": "ACTIVE",
      "createdAt": "2026-06-19T12:00:00Z",
      "updatedAt": "2026-06-19T12:30:00Z",
      "lastMessageAt": "2026-06-19T12:30:00Z"
    },
    "messages": [
      {
        "id": "uuid",
        "conversationId": "uuid",
        "senderType": "USER",
        "content": "Hello, I need help with booking",
        "contentType": "TEXT",
        "metadata": {},
        "isEdited": false,
        "createdAt": "2026-06-19T12:00:00Z"
      },
      {
        "id": "uuid",
        "conversationId": "uuid",
        "senderType": "AI",
        "content": "Hello! I'd be happy to help you with your booking. What service are you looking for?",
        "contentType": "TEXT",
        "metadata": {
          "confidence": 0.95,
          "tokensUsed": 25
        },
        "isEdited": false,
        "createdAt": "2026-06-19T12:00:30Z"
      }
    ]
  }
}
```

#### Close Conversation
```
POST /ai/conversations/{conversationId}/close
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "status": "CLOSED"
  }
}
```

## 2. Analysis Interface

#### Analyze Image
```
POST /ai/analyze-image
Content-Type: multipart/form-data
```

**Request Body:**
```http
Content-Type: multipart/form-data

file: [binary]
analysisType: "defect" | "classification" | "estimation"
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "analysisId": "uuid",
    "results": [
      {
        "type": "defect",
        "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        "description": "Crack detected in foundation",
        "confidence": 0.92,
        "location": "Foundation, North-East corner",
        "recommendation": "Monitor for growth, consult structural engineer if worsens"
      }
    ],
    "overallConfidence": 0.89,
    "processingTime": 3500,
    "tokensUsed": 200
  }
}
```

#### Classify Service
```
POST /ai/classify-service
```

**Request Body:**
```json
{
  "description": "Need plumbing repair for kitchen sink",
  "category": "string"
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "classification": {
      "primaryCategory": "PLUMBING",
      "subCategory": "KITCHEN_REPAIR",
      "confidence": 0.95,
      "suggestedTags": ["plumbing", "kitchen", "sink", "repair"],
      "estimatedDuration": "2-4 hours"
    }
  }
}
```

#### Estimate Cost
```
POST /ai/estimate-cost
```

**Request Body:**
```json
{
  "serviceDescription": "Complete bathroom renovation",
  "serviceCategory": "RENOVATION",
  "location": "Riyadh",
  "urgency": "NORMAL" | "URGENT" | "PLANNED"
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "estimate": {
      "minPrice": 5000,
      "maxPrice": 15000,
      "averagePrice": 10000,
      "currency": "SAR",
      "confidence": 0.85,
      "factors": [
        {
          "factor": "Location",
          "impact": "+15%"
        },
        {
          "factor": "Urgency",
          "impact": "+20%"
        }
      ]
    }
  }
}
```

#### Recommend Provider
```
POST /ai/recommend-provider
```

**Request Body:**
```json
{
  "serviceType": "ELECTRICAL",
  "location": "Riyadh",
  "requirements": {
    "experience": "5+ years",
    "rating": "4.5+",
    "availability": "ASAP"
  }
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "providerId": "uuid",
        "name": "Ahmed Electrician",
        "rating": 4.8,
        "reviewCount": 156,
        "experience": "8 years",
        "specialties": ["Residential", "Commercial", "Emergency"],
        "distance": "2.5 km",
        "availability": "Available today",
        "matchScore": 0.95
      }
    ]
  }
}
```

## 3. WebSocket Contracts

### Connection
```
ws://api.herfa.sa/api/v1/ai/chat
```

### Authentication
Connect with query parameter:
```
?token=<jwt_token>
```

### Events

#### Message Event
```json
{
  "type": "message",
  "payload": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "senderType": "USER" | "AI",
    "content": "string",
    "contentType": "TEXT",
    "timestamp": "2026-06-19T12:00:00Z",
    "metadata": {}
  }
}
```

#### Typing Event
```json
{
  "type": "typing",
  "payload": {
    "conversationId": "uuid",
    "senderType": "AI",
    "isTyping": true
  }
}
```

#### Connection Event
```json
{
  "type": "connection",
  "payload": {
    "status": "connected" | "disconnected",
    "reason": "string"
  }
}
```

#### Error Event
```json
{
  "type": "error",
  "payload": {
    "code": "RATE_LIMIT_EXCEEDED" | "AUTHENTICATION_FAILED" | "SERVICE_UNAVAILABLE",
    "message": "string",
    "retryAfter": 60
  }
}
```

## 4. Error Response Format

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object",
    "retryAfter": 60
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_FAILED` | 401 | Invalid or missing JWT token |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `SERVICE_UNAVAILABLE` | 503 | AI service temporarily unavailable |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Internal server error |

## 5. TypeScript Interfaces

```typescript
// Request Types
interface ChatMessageRequest {
  message: string;
  conversationId?: string;
  context?: {
    bookingId?: string;
    serviceType?: string;
    previousMessages?: Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
  };
}

interface ImageAnalysisRequest {
  file: File;
  analysisType: 'defect' | 'classification' | 'estimation';
}

interface ServiceClassificationRequest {
  description: string;
  category?: string;
}

interface CostEstimationRequest {
  serviceDescription: string;
  serviceCategory: string;
  location: string;
  urgency: 'NORMAL' | 'URGENT' | 'PLANNED';
}

interface ProviderRecommendationRequest {
  serviceType: string;
  location: string;
  requirements: {
    experience?: string;
    rating?: string;
    availability?: string;
  };
}

// Response Types
interface ChatResponse {
  messageId: string;
  conversationId: string;
  reply: string;
  confidence?: number;
  processingTime?: number;
  tokensUsed?: number;
  streaming?: boolean;
  isFallback?: boolean;
}

interface ConversationListResponse {
  conversations: Array<{
    id: string;
    title?: string;
    status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
    messageCount: number;
    lastMessageAt: string;
    createdAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ConversationDetailResponse {
  conversation: {
    id: string;
    userId: string;
    title?: string;
    status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
    createdAt: string;
    updatedAt: string;
    lastMessageAt: string;
  };
  messages: Array<ChatMessage>;
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

interface ImageAnalysisResponse {
  analysisId: string;
  results: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    confidence: number;
    location?: string;
    recommendation?: string;
  }>;
  overallConfidence: number;
  processingTime: number;
  tokensUsed: number;
}

interface ServiceClassificationResponse {
  classification: {
    primaryCategory: string;
    subCategory: string;
    confidence: number;
    suggestedTags: string[];
    estimatedDuration?: string;
  };
}

interface CostEstimationResponse {
  estimate: {
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    currency: string;
    confidence: number;
    factors: Array<{
      factor: string;
      impact: string;
    }>;
  };
}

interface ProviderRecommendationResponse {
  recommendations: Array<{
    providerId: string;
    name: string;
    rating: number;
    reviewCount: number;
    experience: string;
    specialties: string[];
    distance: string;
    availability: string;
    matchScore: number;
  }>;
}

// WebSocket Types
interface WebSocketMessage {
  type: 'message' | 'typing' | 'connection' | 'error';
  payload: any;
}

interface WebSocketMessagePayload {
  messageId?: string;
  conversationId: string;
  senderType: 'USER' | 'AI';
  content: string;
  contentType: 'TEXT';
  timestamp: string;
  metadata?: Record<string, any>;
}

interface WebSocketTypingPayload {
  conversationId: string;
  senderType: 'AI';
  isTyping: boolean;
}

interface WebSocketConnectionPayload {
  status: 'connected' | 'disconnected';
  reason: string;
}

interface WebSocketErrorPayload {
  code: 'RATE_LIMIT_EXCEEDED' | 'AUTHENTICATION_FAILED' | 'SERVICE_UNAVAILABLE';
  message: string;
  retryAfter?: number;
}
```

## 6. Security Considerations

### Authentication
- All endpoints require valid JWT tokens
- Tokens must be included in Authorization header
- Token validation follows existing platform patterns

### Data Privacy
- User messages are logged with anonymization
- AI responses are stored for analysis but with privacy controls
- Sensitive information is filtered from logs

### Rate Limiting
- User-based rate limiting to prevent abuse
- Global rate limiting to protect service availability
- Exponential backoff for retry attempts

### Input Validation
- All inputs are validated using Zod schemas
- File uploads have size and type restrictions
- SQL injection prevention through parameterized queries

## 7. Monitoring and Logging

### Request Logging
All AI requests are logged with:
- Request timestamp
- User ID
- Request type and parameters
- Response time
- Success/failure status
- Error details if applicable

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- Token usage tracking
- Service availability monitoring

### Health Checks
- AI service health endpoints
- Circuit breaker status
- Rate limit status
- System performance metrics

These interface contracts provide a comprehensive foundation for implementing the AI Chat Assistant feature with proper API design, error handling, and security considerations.