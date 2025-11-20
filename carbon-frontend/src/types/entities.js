/**
 * Database Entity Types
 * Based on backend database schema
 */

/**
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} dob - Date of birth
 * @property {string} email - Unique email
 * @property {string} full_name - Full name
 * @property {string} phone_number - Phone number
 * @property {string} roles - EV Owner, CC Buyer, CVA, Admin
 */

/**
 * @typedef {Object} Wallet
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} owner_id - User ID (1 user = 1 wallet)
 * @property {number} balance - Balance (default: 0.0)
 */

/**
 * @typedef {Object} VehicleType
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {number} co2per_km - CO2 per km
 * @property {string} manufacturer - Manufacturer name
 * @property {string} model - Model name
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} owner_id - User ID
 * @property {string} vehicle_type_id - Vehicle type ID
 * @property {string} license_plate - Unique license plate
 * @property {number} mileage - Total mileage (default: 0)
 * @property {string} registration_date - Registration date
 * @property {string} registration_image_url - Registration image URL
 * @property {string} vin - Unique VIN
 */

/**
 * @typedef {Object} Journey
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} vehicle_id - Vehicle ID (1 vehicle = 1 journey)
 * @property {number} distance_km - Distance in km
 * @property {number} energy_used - Energy used
 * @property {number} avg_speed - Average speed
 * @property {number} co2reduced - CO2 reduced
 * @property {string} journey_status - Journey status
 */

/**
 * @typedef {Object} JourneyHistory
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} journey_id - Journey ID
 * @property {number} average_speed - Average speed
 * @property {string} certificate_image_url - Certificate image URL
 * @property {number} energy_used - Energy used
 * @property {number} distance - Distance
 * @property {string} note - Note
 * @property {number} status - Status (smallint)
 * @property {string} verified_by - User ID who verified
 */

/**
 * @typedef {Object} CarbonCredit
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} owner_id - User ID (1 user = 1 carbon credit)
 * @property {number} available_credit - Available credit (default: 0.0)
 * @property {number} total_credit - Total credit (default: 0.0)
 * @property {number} traded_credit - Traded credit (default: 0.0)
 */

/**
 * @typedef {Object} MarketListing
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} seller_id - Seller user ID
 * @property {string} buyer_id - Buyer user ID (nullable)
 * @property {number} price_per_credit - Price per credit
 * @property {number} quantity - Quantity
 * @property {string} start_time - Start time timestamp
 * @property {string} listing_type - Listing type (fixed_price, auction)
 * @property {number} starting_price - Starting price (for auction)
 * @property {string} highest_bid_id - Highest bid ID (for auction)
 */

/**
 * @typedef {Object} Bid
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} bidder_id - Bidder user ID
 * @property {string} listing_id - Listing ID
 * @property {number} amount - Bid amount
 * @property {string} bidder_name - Bidder name
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} buyer_id - Buyer user ID
 * @property {string} seller_id - Seller user ID
 * @property {string} listing_id - Listing ID
 * @property {number} credit - Credit amount
 * @property {number} amount - Transaction amount
 * @property {string} payment_method - Payment method
 * @property {string} payment_url - Payment URL
 * @property {string} status - Transaction status
 */

/**
 * @typedef {Object} Audit
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} action - Action type
 * @property {number} amount - Amount
 * @property {number} balance_after - Balance after transaction
 * @property {string} description - Description
 * @property {string} owner_id - Owner user ID
 * @property {string} reference_id - Reference ID
 * @property {string} type - Audit type
 */

/**
 * @typedef {Object} VerifyRequest
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} user_id - User ID
 * @property {string} description - Description
 * @property {string} document_url - Document URL
 * @property {string} reference_id - Reference ID
 * @property {string} title - Title
 * @property {string} type - Request type
 * @property {string} status - Request status
 */

/**
 * @typedef {Object} Image
 * @property {string} id - UUID
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 * @property {string} data - Image data (base64 or URL)
 * @property {string} name - Image name
 * @property {string} type - Image type
 */

// Export types for use in other files
export default {};

