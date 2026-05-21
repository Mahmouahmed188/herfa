# Data Model: Herfa Platform

## Entities

### User (Collection: `users`)
- `id`: UUID
- `phone`: String (Unique)
- `email`: String (Unique, optional)
- `passwordHash`: String
- `role`: Enum ['CUSTOMER', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN']
- `status`: Enum ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']
- `fcmTokens`: String[]
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Profile (Collection: `profiles`)
- `userId`: Reference<User>
- `firstName`: String
- `lastName`: String
- `avatarUrl`: String
- `address`: Object (Coordinates, AddressLine1, City, Country)
- `language`: Enum ['en', 'ar'] (Default 'ar')

### ProviderDetail (Collection: `provider_details`)
- `userId`: Reference<User>
- `categories`: Reference<Category>[]
- `bio`: String
- `documents`: Object[] (Type, Url, Status)
- `rating`: Number
- `reviewCount`: Number
- `isVerified`: Boolean
- `availability`: Object (Weekly schedule)
- `location`: GeoJSON Point (For real-time tracking)

### Booking (Collection: `bookings`)
- `id`: UUID
- `customerId`: Reference<User>
- `providerId`: Reference<User> (Optional until assigned)
- `categoryId`: Reference<Category>
- `status`: Enum ['DRAFT', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']
- `details`: String
- `media`: String[] (Cloudinary URLs)
- `schedule`: DateTime
- `location`: GeoJSON Point
- `price`: Number
- `commission`: Number
- `disputeId`: Reference<Dispute> (Optional)

### Message (Collection: `messages`)
- `bookingId`: Reference<Booking>
- `senderId`: Reference<User>
- `content`: String
- `mediaUrl`: String
- `isRead`: Boolean
- `timestamp`: DateTime

## Relationships
- User 1:1 Profile
- User 1:1 ProviderDetail (if role is PROVIDER)
- Customer 1:N Booking
- Provider 1:N Booking
- Booking 1:N Message
- Booking 1:1 Review
