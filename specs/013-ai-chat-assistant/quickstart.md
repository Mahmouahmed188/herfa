# Quickstart: AI Chat Assistant

**Date**: 2026-06-19
**Feature**: AI Chat Assistant

## Overview

This quickstart guide provides the essential information needed to begin implementing the AI Chat Assistant feature. The AI Chat Assistant enables users to have conversations with an AI assistant for help with services, bookings, and general inquiries.

## Prerequisites

### Backend Requirements
- NestJS backend with AI Gateway module (planned but not yet implemented)
- PostgreSQL database with AI monitoring tables
- Redis for caching and rate limiting
- External AI service accounts (OpenAI, Google Gemini, etc.)

### Frontend Requirements
- Next.js 14 with App Router
- TanStack Query for data fetching
- Zustand for state management
- Socket.io-client for real-time communication
- Tailwind CSS for styling

## Getting Started

### 1. Backend Setup

#### Environment Configuration
```bash
# .env file
AI_SERVICE_URL=https://api.openai.com/v1
AI_API_KEY=your_openai_api_key
AI_TIMEOUT=30000
AI_MAX_RETRIES=3
AI_RATE_LIMIT_TTL=60
AI_RATE_LIMIT_MAX=100
AI_CIRCUIT_BREAKER_THRESHOLD=5
AI_CIRCUIT_BREAKER_TIMEOUT=30000
```

#### Database Migration
```bash
# Create AI tables
npx prisma migrate dev --name add-ai-tables

# Generate Prisma client
npx prisma generate
```

#### Install Dependencies
```bash
cd apps/api
npm install @nestjs/axios @nestjs/config class-validator class-transformer
npm install prisma-client-lib
```

### 2. Frontend Setup

#### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_AI_CHAT_ENABLED=true
```

#### Install Dependencies
```bash
cd frontend
npm install socket.io-client framer-motion @radix-ui/react-dialog
npm install zod react-hook-form
```

### 3. Project Structure

#### Backend Structure
```
apps/api/src/
├── modules/
│   └── ai-gateway/
│       ├── ai-gateway.controller.ts
│       ├── ai-gateway.service.ts
│       ├── ai-client.service.ts
│       ├── dto/
│       │   ├── chat-request.dto.ts
│       │   ├── chat-response.dto.ts
│       │   └── ai-common.dto.ts
│       ├── guards/
│       │   └── ai-auth.guard.ts
│       └── interceptors/
│           └── ai-logging.interceptor.ts
├── entities/
│   ├── ai-request-log.entity.ts
│   └── ai-health-monitor.entity.ts
└── config/
    └── ai.config.ts
```

#### Frontend Structure
```
src/
├── features/
│   └── ai-chat/
│       ├── services/
│       │   └── api.ts
│       ├── hooks/
│       │   └── useChat.ts
│       ├── components/
│       │   ├── ChatContainer.tsx
│       │   ├── MessageList.tsx
│       │   ├── MessageBubble.tsx
│       │   ├── ChatInput.tsx
│       │   ├── ChatHeader.tsx
│       │   └── TypingIndicator.tsx
│       ├── types/
│       │   └── index.ts
│       └── schemas/
│           └── chat.ts
└── app/
    └── [locale]/
        └── ai-assistant/
            └── page.tsx
```

## Implementation Steps

### Phase 1: Backend AI Gateway

#### 1.1 Create AI Gateway Module
```bash
# Create module directory
mkdir -p apps/api/src/modules/ai-gateway

# Create controller
cat > apps/api/src/modules/ai-gateway/ai-gateway.controller.ts << 'EOF'
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AiGatewayService } from './ai-gateway.service';
import { ChatMessageDto } from './dto/chat-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiGatewayController {
  constructor(private readonly aiGatewayService: AiGatewayService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Body() chatMessage: ChatMessageDto) {
    return this.aiGatewayService.processChatMessage(chatMessage);
  }

  @Get('health')
  async health() {
    return this.aiGatewayService.checkHealth();
  }
}
EOF
```

#### 1.2 Create AI Service
```bash
# Create service
cat > apps/api/src/modules/ai-gateway/ai-gateway.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import { AiClientService } from './ai-client.service';
import { AiRequestLogService } from '../services/ai-request-log.service';
import { ChatMessageDto } from './dto/chat-request.dto';

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);

  constructor(
    private readonly aiClientService: AiClientService,
    private readonly aiRequestLogService: AiRequestLogService,
  ) {}

  async processChatMessage(chatMessage: ChatMessageDto) {
    const requestId = this.generateRequestId();
    
    try {
      // Log request
      await this.aiRequestLogService.logRequest({
        requestId,
        userId: chatMessage.userId,
        endpoint: 'chat',
        requestPayload: chatMessage,
        status: 'PROCESSING'
      });

      // Process with AI service
      const response = await this.aiClientService.chat(chatMessage);

      // Update log with success
      await this.aiRequestLogService.updateRequest(requestId, {
        status: 'SUCCESS',
        responsePayload: response
      });

      return response;
    } catch (error) {
      // Update log with error
      await this.aiRequestLogService.updateRequest(requestId, {
        status: 'FAILED',
        error: error.message
      });

      throw error;
    }
  }

  async checkHealth() {
    return this.aiClientService.checkHealth();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
EOF
```

#### 1.3 Create AI Client Service
```bash
# Create client service
cat > apps/api/src/modules/ai-gateway/ai-client.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import { CircuitBreaker } from 'opossum';

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private readonly axios: Axios;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(private readonly configService: ConfigService) {
    this.axios = new Axios({
      baseURL: this.configService.get<string>('AI_SERVICE_URL'),
      headers: {
        'Authorization': `Bearer ${this.configService.get<string>('AI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      timeout: this.configService.get<number>('AI_TIMEOUT')
    });

    this.circuitBreaker = new CircuitBreaker(
      this.chat.bind(this),
      {
        timeout: this.configService.get<number>('AI_TIMEOUT'),
        errorThresholdPercentage: this.configService.get<number>('AI_CIRCUIT_BREAKER_THRESHOLD'),
        resetTimeout: this.configService.get<number>('AI_CIRCUIT_BREAKER_TIMEOUT')
      }
    );
  }

  async chat(chatMessage: any) {
    return this.circuitBreaker.fire(chatMessage);
  }

  private async chat(chatMessage: any) {
    const response = await this.axios.post('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are Herfa, a professional service assistant helping customers and providers.'
        },
        {
          role: 'user',
          content: chatMessage.message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.data;
  }

  async checkHealth() {
    try {
      const response = await this.axios.get('/models');
      return {
        status: 'healthy',
        service: 'openai',
        timestamp: new Date().toISOString(),
        models: response.data.data
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'openai',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
}
EOF
```

### Phase 2: Frontend Implementation

#### 2.1 Create Chat API Service
```typescript
// src/features/ai-chat/services/api.ts
import { api } from '@/lib/api';

export interface ChatMessageRequest {
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

export interface ChatMessageResponse {
  messageId: string;
  conversationId: string;
  reply: string;
  confidence?: number;
  processingTime?: number;
  tokensUsed?: number;
  streaming?: boolean;
  isFallback?: boolean;
}

export class AIChatService {
  async sendMessage(message: string, conversationId?: string, context?: any) {
    const response = await api.post<ChatMessageResponse>('/ai/chat', {
      message,
      conversationId,
      context
    });
    
    return response.data.data;
  }

  async streamMessage(message: string, onChunk: (chunk: any) => void) {
    const response = await fetch('/api/v1/ai/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Failed to stream message');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No stream reader');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const chunk = JSON.parse(data);
            onChunk(chunk);
          } catch (e) {
            console.error('Stream parse error:', e);
          }
        }
      }
    }
  }
}
```

#### 2.2 Create Chat Hook
```typescript
// src/features/ai-chat/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AIChatService, ChatMessageRequest, ChatMessageResponse } from '../services/api';
import { useAuthStore } from '@/store/useAuthStore';

interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'USER' | 'AI';
  content: string;
  contentType: 'TEXT';
  metadata?: Record<string, any>;
  createdAt: string;
}

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { token } = useAuthStore();

  const aiChatService = new AIChatService();

  const sendMessage = useMutation({
    mutationFn: (request: ChatMessageRequest) => 
      aiChatService.sendMessage(request.message, request.conversationId, request.context),
    onMutate: (request) => {
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId: request.conversationId || 'temp',
        senderType: 'USER',
        content: request.message,
        contentType: 'TEXT',
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
    },
    onSuccess: (data, request) => {
      const aiMessage: ChatMessage = {
        id: data.messageId,
        conversationId: data.conversationId,
        senderType: 'AI',
        content: data.reply,
        contentType: 'TEXT',
        metadata: {
          confidence: data.confidence,
          processingTime: data.processingTime,
          tokensUsed: data.tokensUsed
        },
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsLoading(false);
      setIsTyping(false);
    }
  });

  const getConversationHistory = useQuery({
    queryKey: ['chat', 'history'],
    queryFn: () => aiChatService.getConversationHistory(),
    enabled: !!token
  });

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    getConversationHistory: getConversationHistory.data
  };
};
```

#### 2.3 Create Chat Components
```typescript
// src/features/ai-chat/components/ChatContainer.tsx
import { useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useChat } from '../hooks/useChat';

interface ChatContainerProps {
  conversationId?: string;
}

export function ChatContainer({ conversationId }: ChatContainerProps) {
  const { messages, isLoading, sendMessage } = useChat(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    sendMessage.mutate({ 
      message,
      conversationId 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader conversationId={conversationId} />
      <MessageList messages={messages} isLoading={isLoading} />
      <div ref={messagesEndRef} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
```

```typescript
// src/features/ai-chat/components/MessageList.tsx
import { ChatMessage } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs lg:max-w-md">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

```typescript
// src/features/ai-chat/components/ChatInput.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          className="px-6"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}
```

#### 2.4 Create AI Assistant Page
```typescript
// src/app/[locale]/ai-assistant/page.tsx
import { ChatContainer } from '@/features/ai-chat/components/ChatContainer';

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto h-screen p-4 max-w-4xl">
      <ChatContainer />
    </div>
  );
}
```

### 3. Testing the Implementation

#### 3.1 Backend Testing
```bash
# Start backend
cd apps/api
npm run start:dev

# Test chat endpoint
curl -X POST http://localhost:3001/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"message": "Hello, I need help with my booking"}'
```

#### 3.2 Frontend Testing
```bash
# Start frontend
cd frontend
npm run dev

# Navigate to http://localhost:3000/ai-assistant
# Test the chat interface
```

## Troubleshooting

### Common Issues

#### Backend Issues
- **AI Gateway not found**: Ensure the module is properly imported in `app.module.ts`
- **Authentication failed**: Check JWT token is valid and included in headers
- **Rate limiting**: Verify environment variables are set correctly

#### Frontend Issues
- **API calls failing**: Check `NEXT_PUBLIC_API_URL` is correct
- **Authentication errors**: Verify token is stored in Zustand store
- **WebSocket connection issues**: Check socket.io-client is properly configured

### Debug Commands
```bash
# Check backend logs
cd apps/api && npm run start:dev -- --verbose

# Check frontend build
cd frontend && npm run build

# Run tests
cd apps/api && npm test
cd frontend && npm test
```

## Next Steps

1. **Implement Backend AI Gateway**: Complete the backend implementation with all planned endpoints
2. **Add Real-time Features**: Implement WebSocket support for live chat
3. **Enhance UI**: Add more sophisticated chat features (file upload, rich text, etc.)
4. **Add Monitoring**: Implement comprehensive logging and analytics
5. **Performance Optimization**: Add caching, rate limiting, and optimization

This quickstart provides the foundation for implementing the AI Chat Assistant feature. Follow the implementation steps to get started, and refer to the detailed documentation for more advanced features.