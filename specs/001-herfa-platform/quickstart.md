# Quickstart: Herfa Platform Development

## Local Setup

1. **Clone and Install**:
   ```bash
   git clone <repo>
   npm install
   ```

2. **Environment**:
   Copy `.env.example` to `.env` in `apps/api`, `apps/web`, `apps/mobile`, and `apps/admin`.
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `CLOUDINARY_URL`
   - `FIREBASE_CONFIG`

3. **Running the Platform**:
   ```bash
   # Start all apps in development mode
   npm run dev
   ```

## Test Scenarios

### 1. The "Happy Path" Booking
1. Register as Customer.
2. Register as Provider (upload dummy ID).
3. Admin approves Provider.
4. Customer creates a booking for "Plumbing".
5. Provider accepts booking.
6. Provider starts job (Tracking active).
7. Provider completes job.
8. Customer pays via Stripe.
9. Customer leaves 5-star review.

### 2. RTL Layout Validation
1. Switch language to Arabic.
2. Verify all layouts flip correctly (RTL).
3. Verify form labels and input orientations.
4. Verify navigation drawer/sidebar position.

## Deployment Gates
- All Zod schemas must match `packages/common`.
- 100% coverage on payment and booking state machines.
- Load test pass: 10k concurrent socket connections.
