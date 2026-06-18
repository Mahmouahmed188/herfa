# API Contract: Finance Module

## Endpoints

### 1. List Payments (Customer)
- **Method**: `GET`
- **Path**: `/api/v1/payments`
- **Query**: `page`, `limit`, `status`, `dateFrom`, `dateTo`
- **Response**: `PaginatedResponse<Payment>`

### 2. List Payments (Provider)
- **Method**: `GET`
- **Path**: `/api/v1/payments/provider`
- **Query**: `page`, `limit`, `status`
- **Response**: `PaginatedResponse<Payment>`

### 3. Get Payment Details
- **Method**: `GET`
- **Path**: `/api/v1/payments/:id`
- **Response**: `ApiResponse<Payment>`

### 4. Process Payment
- **Method**: `POST`
- **Path**: `/api/v1/payments/:id/process`
- **Body**: `{ paymentMethod: string, transactionRef?: string }`
- **Response**: `ApiResponse<{ status: string, transactionId: string }>`

### 5. Issue Refund (Admin)
- **Method**: `POST`
- **Path**: `/api/v1/payments/admin/:id/refund`
- **Body**: `{ amount: number, reason: string }`
- **Response**: `ApiResponse<Refund>`

### 6. List Payout Requests (Admin/Provider)
- **Method**: `GET`
- **Path**: `/api/v1/finance/payouts`
- **Response**: `PaginatedResponse<PayoutRequest>`

## DTOs

### Payment DTO
```typescript
interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'FAILED' | 'CANCELLED';
  paymentMethod: string;
  transactionRef: string;
  createdAt: string;
  updatedAt: string;
}
```

### Refund DTO
```typescript
interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}
```
