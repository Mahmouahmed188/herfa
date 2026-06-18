# Data Model: Admin Dashboard Integration

**Date**: 2026-06-19  
**Feature**: Admin Dashboard Integration  
**Phase**: 1 - Design & Contracts

## Entities

### Administrator
- **id**: string - Unique identifier for admin user
- **email**: string - Admin email address (unique)
- **name**: string - Admin display name
- **role**: 'super_admin' | 'admin' | 'support_admin' - Admin role and permissions
- **permissions**: string[] - Array of specific permissions
- **isActive**: boolean - Whether admin account is active
- **lastLogin**: Date - Last login timestamp
- **createdAt**: Date - Account creation timestamp
- **updatedAt**: Date - Last account update timestamp

### User
- **id**: string - Unique user identifier
- **email**: string - User email address (unique)
- **name**: string - User display name
- **phone**: string - User phone number
- **role**: 'client' | 'technician' | 'admin' - User role
- **status**: 'active' | 'suspended' | 'pending' | 'banned' - Account status
- **registrationDate**: Date - Account creation timestamp
- **lastLogin**: Date - Last login timestamp
- **profile**: UserProfile - Complete user profile information
- **bookingHistory**: Booking[] - User's booking history
- **activitySummary**: ActivitySummary - Recent user activity summary

### UserProfile
- **id**: string - Profile identifier
- **userId**: string - Associated user ID
- **avatar**: string | null - Profile image URL
- **bio**: string | null - User biography
- **address**: Address | null - User address
- **preferences**: UserPreferences - User preferences and settings
- **verification**: VerificationStatus - Account verification status
- **createdAt**: Date - Profile creation timestamp
- **updatedAt**: Date - Profile last update timestamp

### Provider
- **id**: string - Unique provider identifier
- **userId**: string - Associated user ID
- **categories**: ServiceCategory[] - Service categories offered
- **ratings**: ProviderRatings - Rating information
- **verification**: Verification - Verification status and data
- **services**: Service[] - Services offered by provider
- **reviews**: Review[] - Provider reviews
- **statistics**: ProviderStatistics - Performance metrics
- **isActive**: boolean - Whether provider is currently active
- **createdAt**: Date - Provider registration timestamp
- **updatedAt**: Date - Last provider update timestamp

### ServiceCategory
- **id**: string - Category identifier
- **name**: string - Category name
- **description**: string - Category description
- **isActive**: boolean - Whether category is active

### ProviderRatings
- **averageRating**: number - Average rating (0-5)
- **totalReviews**: number - Total number of reviews
- **ratingDistribution**: RatingDistribution - Rating distribution by star count

### RatingDistribution
- **5**: number - Number of 5-star reviews
- **4**: number - Number of 4-star reviews
- **3**: number - Number of 3-star reviews
- **2**: number - Number of 2-star reviews
- **1**: number - Number of 1-star reviews

### Verification
- **id**: string - Verification identifier
- **providerId**: string - Associated provider ID
- **status**: 'pending' | 'approved' | 'rejected' | 'suspended' - Verification status
- **documents**: VerificationDocument[] - Submitted verification documents
- **history**: VerificationHistory[] - Verification process history
- **reviewedBy**: string | null - Admin who reviewed the verification
- **reviewedAt**: Date | null - Review timestamp
- **createdAt**: Date - Verification request timestamp
- **updatedAt**: Date - Last verification update timestamp

### VerificationDocument
- **id**: string - Document identifier
- **type**: 'id' | 'license' | 'certificate' | 'insurance' | 'other' - Document type
- **url**: string - Document URL
- **filename**: string - Original filename
- **uploadedAt**: Date - Upload timestamp
- **status**: 'pending' | 'approved' | 'rejected' - Document review status

### VerificationHistory
- **id**: string - History entry identifier
- **action**: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'suspended' - Action performed
- **adminId**: string | null - Admin who performed the action
- **notes**: string | null - Additional notes
- **timestamp**: Date - Action timestamp

### Booking
- **id**: string - Unique booking identifier
- **userId**: string - Customer user ID
- **providerId**: string - Provider user ID
- **serviceId**: string - Service being booked
- **status**: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' - Booking status
- **scheduledDate**: Date - Scheduled service date
- **scheduledTime**: string - Scheduled service time
- **duration**: number - Service duration in minutes
- **totalAmount**: number - Total booking amount
- **paymentStatus**: 'pending' | 'paid' | 'failed' | 'refunded' - Payment status
- **createdAt**: Date - Booking creation timestamp
- **updatedAt**: Date - Last booking update timestamp
- **completedAt**: Date | null - Booking completion timestamp

### Payment
- **id**: string - Unique payment identifier
- **bookingId**: string - Associated booking ID
- **userId**: string - User making payment
- **providerId**: string - Provider receiving payment
- **amount**: number - Payment amount
- **currency**: string - Payment currency
- **status**: 'pending' | 'completed' | 'failed' | 'refunded' - Payment status
- **method**: 'credit_card' | 'bank_transfer' | 'wallet' | 'other' - Payment method
- **transactionId**: string | null - External transaction ID
- **createdAt**: Date - Payment creation timestamp
- **completedAt**: Date | null - Payment completion timestamp
- **refundedAt**: Date | null - Refund timestamp

### Refund
- **id**: string - Unique refund identifier
- **paymentId**: string - Associated payment ID
- **bookingId**: string - Associated booking ID
- **amount**: number - Refund amount
- **currency**: string - Refund currency
- **status**: 'pending' | 'approved' | 'rejected' | 'processed' - Refund status
- **reason**: string - Refund reason
- **requestedBy**: string - User who requested refund
- **approvedBy**: string | null - Admin who approved refund
- **processedAt**: Date | null - Refund processing timestamp
- **createdAt**: Date - Refund request timestamp
- **updatedAt**: Date - Last refund update timestamp

### SupportTicket
- **id**: string - Unique ticket identifier
- **userId**: string - User who created ticket
- **providerId**: string | null - Associated provider ID
- **bookingId**: string | null - Associated booking ID
- **subject**: string - Ticket subject
- **category**: 'technical' | 'billing' | 'booking' | 'account' | 'other' - Ticket category
- **priority**: 'low' | 'medium' | 'high' | 'urgent' - Ticket priority
- **status**: 'open' | 'in_progress' | 'resolved' | 'closed' - Ticket status
- **assigneeId**: string | null - Assigned admin ID
- **createdAt**: Date - Ticket creation timestamp
- **updatedAt**: Date - Last ticket update timestamp
- **resolvedAt**: Date | null - Ticket resolution timestamp

### SupportMessage
- **id**: string - Unique message identifier
- **ticketId**: string - Associated ticket ID
- **userId**: string | null - User who sent message
- **adminId**: string | null - Admin who sent message
- **content**: string - Message content
- **type**: 'user' | 'admin' | 'system' - Message type
- **attachments**: Attachment[] - Message attachments
- **createdAt**: Date - Message creation timestamp

### Attachment
- **id**: string - Unique attachment identifier
- **filename**: string - Original filename
- **url**: string - File URL
- **size**: number - File size in bytes
- **mimeType**: string - File MIME type
- **uploadedAt**: Date - Upload timestamp

### Dispute
- **id**: string - Unique dispute identifier
- **bookingId**: string - Associated booking ID
- **userId**: string - User who filed dispute
- **providerId**: string - Provider involved in dispute
- **reason**: 'service_quality' | 'payment_issue' | 'no_show' | 'other' - Dispute reason
- **status**: 'open' | 'in_progress' | 'resolved' | 'closed' - Dispute status
- **evidence**: DisputeEvidence[] - Dispute evidence
- **history**: DisputeHistory[] - Dispute process history
- **resolvedAt**: Date | null - Dispute resolution timestamp
- **createdAt**: Date - Dispute creation timestamp
- **updatedAt**: Date - Last dispute update timestamp

### DisputeEvidence
- **id**: string - Evidence identifier
- **type**: 'photo' | 'document' | 'message' | 'other' - Evidence type
- **url**: string - Evidence URL
- **description**: string - Evidence description
- **uploadedAt**: Date - Upload timestamp

### DisputeHistory
- **id**: string - History entry identifier
- **action**: 'filed' | 'reviewed' | 'resolved' | 'closed' - Action performed
- **adminId**: string | null - Admin who performed the action
- **notes**: string | null - Additional notes
- **timestamp**: Date - Action timestamp

### Review
- **id**: string - Unique review identifier
- **bookingId**: string - Associated booking ID
- **userId**: string - User who wrote review
- **providerId**: string - Provider being reviewed
- **rating**: number - Rating (1-5)
- **comment**: string | null - Review comment
- **status**: 'visible' | 'hidden' | 'pending' - Review visibility status
- **createdAt**: Date - Review creation timestamp
- **updatedAt**: Date - Last review update timestamp

### ActivityLog
- **id**: string - Unique log entry identifier
- **action**: string - Action performed
- **actorType**: 'user' | 'provider' | 'admin' | 'system' - Actor type
- **actorId**: string | null - Actor identifier
- **targetType**: string | null - Target entity type
- **targetId**: string | null - Target entity identifier
- **details**: Record<string, any> | null - Additional action details
- **timestamp**: Date - Action timestamp
- **ipAddress**: string | null - IP address of actor
- **userAgent**: string | null - User agent string

### Notification
- **id**: string - Unique notification identifier
- **type**: 'alert' | 'announcement' | 'system' | 'operational' - Notification type
- **title**: string - Notification title
- **message**: string - Notification message
- **priority**: 'low' | 'medium' | 'high' - Notification priority
- **targetAudience**: 'all' | 'admins' | 'users' | 'providers' - Target audience
- **isActive**: boolean - Whether notification is active
- **createdAt**: Date - Notification creation timestamp
- **expiresAt**: Date | null - Notification expiration timestamp

### AnalyticsData
- **period**: 'daily' | 'weekly' | 'monthly' | 'yearly' - Time period
- **metric**: string - Metric name
- **value**: number - Metric value
- **timestamp**: Date - Metric timestamp
- **dimension**: Record<string, any> | null - Additional dimensions

## Relationships

### User → Provider
- One-to-many: A user can be both a customer and a provider
- When user role is 'technician', they have an associated Provider record

### Provider → Services
- One-to-many: A provider can offer multiple services

### Booking → User & Provider
- Many-to-one: Many bookings can be associated with one user and one provider

### Booking → Payment
- One-to-one: Each booking has exactly one payment

### Payment → Refund
- One-to-many: A payment can have multiple refunds

### SupportTicket → User & Provider & Booking
- Many-to-one: Many tickets can be associated with users, providers, and bookings

### Review → User & Provider & Booking
- Many-to-one: Many reviews can be associated with users, providers, and bookings

### Dispute → Booking → User & Provider
- Many-to-one through booking: Disputes are associated with bookings which link to users and providers

### ActivityLog → Actor (User/Provider/Admin)
- Many-to-one: Many activity logs can be associated with one actor

## Validation Rules

### User Status Transitions
- 'active' → 'suspended': Allowed (admin action)
- 'suspended' → 'active': Allowed (admin action)
- 'pending' → 'active': Allowed (verification completion)
- 'banned': Terminal status (requires admin intervention)

### Provider Status Transitions
- 'pending' → 'approved': Allowed (admin verification)
- 'approved' → 'suspended': Allowed (admin action)
- 'suspended' → 'approved': Allowed (admin action)
- 'rejected': Requires resubmission (admin verification)

### Booking Status Transitions
- 'pending' → 'confirmed': Allowed (auto/manual)
- 'confirmed' → 'in_progress': Allowed (service start)
- 'in_progress' → 'completed': Allowed (service completion)
- Any status → 'cancelled': Allowed (with refund processing)
- 'confirmed'/'in_progress' → 'disputed': Allowed (dispute filing)

### Payment Status Transitions
- 'pending' → 'completed': Allowed (payment success)
- 'pending' → 'failed': Allowed (payment failure)
- 'completed' → 'refunded': Allowed (refund processing)

### Ticket Status Transitions
- 'open' → 'in_progress': Allowed (assignment)
- 'in_progress' → 'resolved': Allowed (resolution)
- 'resolved' → 'closed': Allowed (confirmation)

### Dispute Status Transitions
- 'open' → 'in_progress': Allowed (review start)
- 'in_progress' → 'resolved': Allowed (resolution)
- 'resolved' → 'closed': Allowed (confirmation)

### Review Status Transitions
- 'pending' → 'visible': Allowed (moderation approval)
- 'visible' → 'hidden': Allowed (moderation action)
- 'hidden' → 'visible': Allowed (moderation action)