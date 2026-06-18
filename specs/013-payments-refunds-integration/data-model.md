# Data Model: Payments & Refunds

## Entities

### Payment
Represents a financial transaction associated with a booking.
- **id**: `UUID` (Primary Key)
- **bookingId**: `UUID` (Foreign Key to Booking)
- **customerId**: `UUID` (Foreign Key to User)
- **providerId**: `UUID` (Foreign Key to User)
- **amount**: `Decimal` (Transaction amount)
- **currency**: `String` (e.g., "SAR")
- **status**: `Enum` (pending, authorized, paid, refunded, partially_refunded, failed, cancelled)
- **paymentMethod**: `String` (e.g., "credit_card", "wallet", "apple_pay")
- **transactionRef**: `String` (External gateway reference)
- **createdAt**: `DateTime`
- **updatedAt**: `DateTime`

### Refund
Represents a return of funds for a specific payment.
- **id**: `UUID` (Primary Key)
- **paymentId**: `UUID` (Foreign Key to Payment)
- **amount**: `Decimal` (Refunded amount)
- **reason**: `String` (User-provided reason)
- **status**: `Enum` (requested, under_review, approved, rejected, processed, completed)
- **refundedBy**: `UUID` (Admin ID who processed the refund)
- **createdAt**: `DateTime`
- **updatedAt**: `DateTime`

### FinancialSummary (Derived)
Aggregated data for dashboards.
- **totalEarnings**: `Decimal` (Sum of paid payments for provider)
- **pendingEarnings**: `Decimal` (Sum of authorized/pending payments)
- **totalRefunds**: `Decimal` (Sum of processed refunds)
- **transactionCount**: `Integer`

## State Transitions

### Payment Lifecycle
1. `pending`: Initial state upon booking creation.
2. `authorized`: Funds reserved by gateway.
3. `paid`: Funds successfully captured.
4. `failed`: Payment attempt unsuccessful.
5. `refunded`: Full amount returned to customer.
6. `partially_refunded`: Part of the amount returned.

### Refund Lifecycle
1. `requested`: Customer/Admin initiated request.
2. `under_review`: Admin reviewing the request.
3. `approved`: Refund authorized.
4. `processed`: Sent to payment gateway.
5. `completed`: Funds confirmed returned.
6. `rejected`: Refund request denied.
