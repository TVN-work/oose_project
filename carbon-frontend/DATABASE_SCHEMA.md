# Database Schema Documentation

This document describes the database schema for the Carbon Credit Marketplace backend system.

## Overview

The system uses PostgreSQL with a **Database per Service** architecture. Each microservice has its own database, but the schema below represents the unified data model across all services.

## Tables

### 1. users

User accounts for all actors in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| dob | date | | Date of birth |
| email | varchar(255) | UNIQUE, NOT NULL | User email |
| full_name | varchar(255) | | Full name |
| phone_number | varchar(255) | | Phone number |
| roles | varchar(255) | | Role: EV Owner, CC Buyer, CVA, Admin |

**Relationships:**
- One-to-one with `wallet` (via `owner_id`)
- One-to-many with `vehicles` (via `owner_id`)
- One-to-one with `carbon_credit` (via `owner_id`)

### 2. wallet

Payment wallets for users (1 user = 1 wallet).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| owner_id | varchar(36) | NOT NULL, UNIQUE | User ID (FK to users.id) |
| balance | double | DEFAULT: 0.0 | Wallet balance |

**Relationships:**
- Many-to-one with `users` (via `owner_id`)
- One-to-many with `audit` (via `owner_id`)

### 3. vehicle_types

Vehicle type definitions with CO2 emission factors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| co2per_km | double | | CO2 emission per km |
| manufacturer | varchar(255) | | Manufacturer name |
| model | varchar(255) | | Model name |

**Relationships:**
- One-to-many with `vehicles` (via `vehicle_type_id`)

### 4. vehicles

EV vehicles owned by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| owner_id | varchar(36) | NOT NULL | User ID (FK to users.id) |
| vehicle_type_id | varchar(36) | NOT NULL | Vehicle type ID (FK to vehicle_types.id) |
| license_plate | varchar(255) | UNIQUE | License plate number |
| mileage | bigint | DEFAULT: 0 | Total mileage |
| registration_date | date | | Registration date |
| registration_image_url | varchar(255) | | Registration document URL |
| vin | varchar(255) | UNIQUE | Vehicle Identification Number |

**Relationships:**
- Many-to-one with `users` (via `owner_id`)
- Many-to-one with `vehicle_types` (via `vehicle_type_id`)
- One-to-one with `journey` (via `vehicle_id`)

### 5. journey

Current journey data for each vehicle (1 vehicle = 1 journey).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| vehicle_id | varchar(36) | NOT NULL, UNIQUE | Vehicle ID (FK to vehicles.id) |
| distance_km | double | NOT NULL | Distance in kilometers |
| energy_used | double | | Energy consumed |
| avg_speed | double | | Average speed |
| co2reduced | double | | CO2 reduced amount |
| journey_status | varchar(255) | | Journey status |

**Relationships:**
- Many-to-one with `vehicles` (via `vehicle_id`)
- One-to-many with `journey_histories` (via `journey_id`)

### 6. journey_histories

Historical records of journey verifications and calculations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| journey_id | varchar(36) | NOT NULL | Journey ID (FK to journey.id) |
| average_speed | double | | Average speed |
| certificate_image_url | varchar(255) | | Certificate image URL |
| energy_used | double | | Energy used |
| distance | double | | Distance |
| note | text | | Verification notes |
| status | smallint | | Status: 1=verified, 0=pending, -1=rejected |
| verified_by | varchar(36) | | User ID who verified (FK to users.id) |

**Relationships:**
- Many-to-one with `journey` (via `journey_id`)
- Many-to-one with `users` (via `verified_by`)

### 7. carbon_credit

Carbon credit balances for users (1 user = 1 carbon credit record).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| owner_id | varchar(36) | NOT NULL, UNIQUE | User ID (FK to users.id) |
| available_credit | double | DEFAULT: 0.0 | Available credits |
| total_credit | double | DEFAULT: 0.0 | Total credits earned |
| traded_credit | double | DEFAULT: 0.0 | Credits traded/sold |

**Relationships:**
- Many-to-one with `users` (via `owner_id`)

### 8. market_listing

Carbon credit listings for sale (fixed price or auction).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| seller_id | varchar(36) | NOT NULL | Seller user ID (FK to users.id) |
| buyer_id | varchar(36) | | Buyer user ID (FK to users.id, nullable) |
| price_per_credit | double | | Price per credit |
| quantity | double | | Credit quantity |
| start_time | timestamp | | Listing start time |
| listing_type | varchar(255) | | Type: fixed_price or auction |
| starting_price | double | | Starting price (for auction) |
| highest_bid_id | varchar(36) | | Highest bid ID (FK to bid.id, for auction) |

**Relationships:**
- Many-to-one with `users` (seller, via `seller_id`)
- Many-to-one with `users` (buyer, via `buyer_id`)
- Many-to-one with `bid` (via `highest_bid_id`)
- One-to-many with `bid` (via `listing_id`)
- One-to-many with `transactions` (via `listing_id`)

### 9. bid

Bids placed on auction listings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| bidder_id | varchar(36) | NOT NULL | Bidder user ID (FK to users.id) |
| listing_id | varchar(36) | NOT NULL | Listing ID (FK to market_listing.id) |
| amount | double | NOT NULL | Bid amount |
| bidder_name | varchar(255) | | Bidder name |

**Relationships:**
- Many-to-one with `users` (via `bidder_id`)
- Many-to-one with `market_listing` (via `listing_id`)

### 10. transactions

Transaction records for credit purchases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| buyer_id | varchar(36) | NOT NULL | Buyer user ID (FK to users.id) |
| seller_id | varchar(36) | NOT NULL | Seller user ID (FK to users.id) |
| listing_id | varchar(36) | NOT NULL | Listing ID (FK to market_listing.id) |
| credit | double | | Credit amount |
| amount | double | | Transaction amount |
| payment_method | text | | Payment method |
| payment_url | text | | Payment URL |
| status | varchar(255) | | Transaction status |

**Relationships:**
- Many-to-one with `users` (buyer, via `buyer_id`)
- Many-to-one with `users` (seller, via `seller_id`)
- Many-to-one with `market_listing` (via `listing_id`)

### 11. audit

Audit log for wallet transactions and credit operations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| action | varchar(255) | | Action type |
| amount | double | | Transaction amount |
| balance_after | double | | Balance after transaction |
| description | varchar(255) | | Description |
| owner_id | varchar(36) | NOT NULL | Owner user ID (FK to users.id) |
| reference_id | varchar(36) | | Reference ID (transaction, journey, etc.) |
| type | varchar(255) | | Audit type (credit, payment, etc.) |

**Relationships:**
- Many-to-one with `users` (via `owner_id`)

### 12. verify_request

Verification requests for carbon credit issuance.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| user_id | varchar(36) | NOT NULL | User ID (FK to users.id) |
| description | varchar(255) | | Description |
| document_url | varchar(255) | | Document URL |
| reference_id | varchar(36) | | Reference ID (journey_id, etc.) |
| title | varchar(255) | | Request title |
| type | varchar(255) | | Request type |
| status | varchar(255) | | Request status (pending, approved, rejected) |

**Relationships:**
- Many-to-one with `users` (via `user_id`)

### 13. images

Image storage for documents, certificates, and vehicle registrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar(36) | PK | UUID |
| created_at | timestamp | | Creation timestamp |
| updated_at | timestamp | | Last update timestamp |
| data | text | | Image data (base64 or URL) |
| name | varchar(255) | | Image name |
| type | varchar(255) | | Image type |

## Relationships Summary

### One-to-One
- `users` ↔ `wallet` (1 user = 1 wallet)
- `users` ↔ `carbon_credit` (1 user = 1 carbon credit record)
- `vehicles` ↔ `journey` (1 vehicle = 1 current journey)

### One-to-Many
- `users` → `vehicles`
- `users` → `transactions` (as buyer or seller)
- `users` → `audit`
- `users` → `verify_request`
- `vehicle_types` → `vehicles`
- `vehicles` → `journey_histories`
- `market_listing` → `bid`
- `market_listing` → `transactions`
- `journey` → `journey_histories`

### Many-to-One
- `vehicles` → `users` (owner)
- `vehicles` → `vehicle_types`
- `journey` → `vehicles`
- `journey_histories` → `journey`
- `journey_histories` → `users` (verifier)
- `bid` → `users` (bidder)
- `bid` → `market_listing`
- `transactions` → `users` (buyer, seller)
- `transactions` → `market_listing`
- `audit` → `users` (owner)
- `verify_request` → `users`

## API Endpoints Mapping

### Vehicle Service
- `GET /vehicles/types` → `vehicle_types`
- `GET /vehicles` → `vehicles`
- `GET /vehicles/journeys` → `journey`
- `GET /vehicles/journeys/:id/histories` → `journey_histories`

### Wallet Service
- `GET /wallets` → `wallet`
- `GET /wallets/carbon` → `carbon_credit`
- `GET /wallets/audits` → `audit`

### Market Service
- `GET /market/listings` → `market_listing`
- `GET /market/bids` → `bid`

### Transaction Service
- `GET /transactions` → `transactions`

### Verification Service
- `GET /verification/requests` → `verify_request`

### Media Service
- `GET /media/images` → `images`

## Notes

1. **UUID Format**: All IDs use UUID v4 format (36 characters including hyphens)
2. **Timestamps**: All timestamps are in ISO 8601 format
3. **Status Fields**: Use string values for flexibility (e.g., "pending", "approved", "rejected")
4. **Relationships**: Foreign keys are enforced at the application level (microservices communicate via API)
5. **Unique Constraints**: 
   - `users.email` is unique
   - `vehicles.license_plate` is unique
   - `vehicles.vin` is unique
   - `wallet.owner_id` is unique (1:1 relationship)
   - `carbon_credit.owner_id` is unique (1:1 relationship)
   - `journey.vehicle_id` is unique (1:1 relationship)

