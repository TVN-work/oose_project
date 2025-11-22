/**
 * Mock Database Service
 * 
 * This service simulates a database layer for development.
 * When switching to real backend, only change the API endpoints in config/api.js
 * and set VITE_USE_MOCK=false in .env
 * 
 * All data follows the exact database schema structure from DATABASE_SCHEMA.md
 */

import {
  mockUsers,
  mockWallets,
  mockVehicleTypes,
  mockVehicles,
  mockJourneys,
  mockJourneyHistories,
  mockCarbonCredits,
  mockMarketListings,
  mockBids,
  mockTransactions,
  mockAudits,
  mockVerifyRequests,
  mockImages,
  generateId,
  getTimestamp,
} from './mockData';

/**
 * In-memory database storage
 * This simulates database tables
 */
class MockDatabase {
  constructor() {
    // Initialize with mock data
    this.users = Object.values(mockUsers);
    this.wallets = Object.values(mockWallets);
    this.vehicleTypes = [...mockVehicleTypes];
    this.vehicles = [...mockVehicles];
    this.journeys = [...mockJourneys];
    this.journeyHistories = [...mockJourneyHistories];
    this.carbonCredits = Object.values(mockCarbonCredits);
    this.marketListings = [...mockMarketListings];
    this.bids = [...mockBids];
    this.transactions = [...mockTransactions];
    this.audits = [...mockAudits];
    this.verifyRequests = [...mockVerifyRequests];
    this.images = [...mockImages];
  }

  // ========== USERS ==========
  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUsersByRole(role) {
    return this.users.filter(u => u.roles === role);
  }

  createUser(userData) {
    const newUser = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, userData) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.users[index] = {
      ...this.users[index],
      ...userData,
      updated_at: getTimestamp(),
    };
    return this.users[index];
  }

  deleteUser(id) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // ========== WALLETS ==========
  findWalletByOwnerId(ownerId) {
    return this.wallets.find(w => w.owner_id === ownerId);
  }

  createWallet(walletData) {
    const newWallet = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      balance: 0.0,
      ...walletData,
    };
    this.wallets.push(newWallet);
    return newWallet;
  }

  updateWalletBalance(ownerId, newBalance) {
    const wallet = this.findWalletByOwnerId(ownerId);
    if (!wallet) return null;
    
    wallet.balance = newBalance;
    wallet.updated_at = getTimestamp();
    return wallet;
  }

  // ========== VEHICLE TYPES ==========
  findAllVehicleTypes() {
    return [...this.vehicleTypes];
  }

  findVehicleTypeById(id) {
    return this.vehicleTypes.find(vt => vt.id === id);
  }

  findVehicleTypesByCategory(category) {
    return this.vehicleTypes.filter(vt => vt.category === category);
  }

  // ========== VEHICLES ==========
  findVehicleById(id) {
    return this.vehicles.find(v => v.id === id);
  }

  findVehiclesByOwnerId(ownerId) {
    return this.vehicles.filter(v => v.owner_id === ownerId);
  }

  findVehicleByLicensePlate(licensePlate) {
    return this.vehicles.find(v => v.license_plate === licensePlate);
  }

  findVehicleByVin(vin) {
    return this.vehicles.find(v => v.vin === vin);
  }

  createVehicle(vehicleData) {
    const newVehicle = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      mileage: 0,
      ...vehicleData,
    };
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  updateVehicle(id, vehicleData) {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    this.vehicles[index] = {
      ...this.vehicles[index],
      ...vehicleData,
      updated_at: getTimestamp(),
    };
    return this.vehicles[index];
  }

  deleteVehicle(id) {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.vehicles.splice(index, 1);
    return true;
  }

  // ========== JOURNEYS ==========
  findJourneyById(id) {
    return this.journeys.find(j => j.id === id);
  }

  findJourneyByVehicleId(vehicleId) {
    return this.journeys.find(j => j.vehicle_id === vehicleId);
  }

  findJourneysByOwnerId(ownerId) {
    const ownerVehicles = this.findVehiclesByOwnerId(ownerId);
    const vehicleIds = ownerVehicles.map(v => v.id);
    return this.journeys.filter(j => vehicleIds.includes(j.vehicle_id));
  }

  createJourney(journeyData) {
    const newJourney = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      ...journeyData,
    };
    this.journeys.push(newJourney);
    return newJourney;
  }

  updateJourney(id, journeyData) {
    const index = this.journeys.findIndex(j => j.id === id);
    if (index === -1) return null;
    
    this.journeys[index] = {
      ...this.journeys[index],
      ...journeyData,
      updated_at: getTimestamp(),
    };
    return this.journeys[index];
  }

  // ========== JOURNEY HISTORIES ==========
  findJourneyHistoryById(id) {
    return this.journeyHistories.find(jh => jh.id === id);
  }

  findJourneyHistoriesByJourneyId(journeyId) {
    return this.journeyHistories.filter(jh => jh.journey_id === journeyId);
  }

  createJourneyHistory(historyData) {
    const newHistory = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: 0, // 0 = pending by default
      ...historyData,
    };
    this.journeyHistories.push(newHistory);
    return newHistory;
  }

  updateJourneyHistoryStatus(id, status, verifiedBy = null) {
    const index = this.journeyHistories.findIndex(jh => jh.id === id);
    if (index === -1) return null;
    
    this.journeyHistories[index] = {
      ...this.journeyHistories[index],
      status,
      verified_by: verifiedBy || this.journeyHistories[index].verified_by,
      updated_at: getTimestamp(),
    };
    return this.journeyHistories[index];
  }

  // ========== CARBON CREDITS ==========
  findCarbonCreditByOwnerId(ownerId) {
    return this.carbonCredits.find(cc => cc.owner_id === ownerId);
  }

  createCarbonCredit(creditData) {
    const newCredit = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      available_credit: 0.0,
      total_credit: 0.0,
      traded_credit: 0.0,
      ...creditData,
    };
    this.carbonCredits.push(newCredit);
    return newCredit;
  }

  updateCarbonCredit(ownerId, creditData) {
    const credit = this.findCarbonCreditByOwnerId(ownerId);
    if (!credit) return null;
    
    Object.assign(credit, creditData, { updated_at: getTimestamp() });
    return credit;
  }

  addCarbonCredit(ownerId, amount) {
    const credit = this.findCarbonCreditByOwnerId(ownerId);
    if (!credit) return null;
    
    credit.available_credit += amount;
    credit.total_credit += amount;
    credit.updated_at = getTimestamp();
    return credit;
  }

  deductCarbonCredit(ownerId, amount) {
    const credit = this.findCarbonCreditByOwnerId(ownerId);
    if (!credit || credit.available_credit < amount) return null;
    
    credit.available_credit -= amount;
    credit.traded_credit += amount;
    credit.updated_at = getTimestamp();
    return credit;
  }

  // ========== MARKET LISTINGS ==========
  findListingById(id) {
    return this.marketListings.find(l => l.id === id);
  }

  findListingsBySellerId(sellerId) {
    return this.marketListings.filter(l => l.seller_id === sellerId);
  }

  findAllListings() {
    return [...this.marketListings];
  }

  createListing(listingData) {
    const newListing = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      buyer_id: null,
      highest_bid_id: null,
      ...listingData,
    };
    this.marketListings.push(newListing);
    return newListing;
  }

  updateListing(id, listingData) {
    const index = this.marketListings.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    this.marketListings[index] = {
      ...this.marketListings[index],
      ...listingData,
      updated_at: getTimestamp(),
    };
    return this.marketListings[index];
  }

  deleteListing(id) {
    const index = this.marketListings.findIndex(l => l.id === id);
    if (index === -1) return false;
    this.marketListings.splice(index, 1);
    return true;
  }

  // ========== BIDS ==========
  findBidById(id) {
    return this.bids.find(b => b.id === id);
  }

  findBidsByListingId(listingId) {
    return this.bids.filter(b => b.listing_id === listingId);
  }

  createBid(bidData) {
    const newBid = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      ...bidData,
    };
    this.bids.push(newBid);
    return newBid;
  }

  // ========== TRANSACTIONS ==========
  findTransactionById(id) {
    return this.transactions.find(t => t.id === id);
  }

  findTransactionsByBuyerId(buyerId) {
    return this.transactions.filter(t => t.buyer_id === buyerId);
  }

  findTransactionsBySellerId(sellerId) {
    return this.transactions.filter(t => t.seller_id === sellerId);
  }

  createTransaction(transactionData) {
    const newTransaction = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: 'pending',
      ...transactionData,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransactionStatus(id, status) {
    const transaction = this.findTransactionById(id);
    if (!transaction) return null;
    
    transaction.status = status;
    transaction.updated_at = getTimestamp();
    return transaction;
  }

  // ========== AUDITS ==========
  findAuditsByOwnerId(ownerId) {
    return this.audits.filter(a => a.owner_id === ownerId);
  }

  createAudit(auditData) {
    const newAudit = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      ...auditData,
    };
    this.audits.push(newAudit);
    return newAudit;
  }

  // ========== VERIFY REQUESTS ==========
  findVerifyRequestById(id) {
    return this.verifyRequests.find(vr => vr.id === id);
  }

  findAllVerifyRequests() {
    return [...this.verifyRequests];
  }

  createVerifyRequest(requestData) {
    const newRequest = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      status: 'pending',
      ...requestData,
    };
    this.verifyRequests.push(newRequest);
    return newRequest;
  }

  updateVerifyRequestStatus(id, status) {
    const request = this.findVerifyRequestById(id);
    if (!request) return null;
    
    request.status = status;
    request.updated_at = getTimestamp();
    return request;
  }

  // ========== IMAGES ==========
  findImageById(id) {
    return this.images.find(img => img.id === id);
  }

  createImage(imageData) {
    const newImage = {
      id: generateId(),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
      ...imageData,
    };
    this.images.push(newImage);
    return newImage;
  }

  // ========== UTILITY METHODS ==========
  
  /**
   * Reset database to initial state
   */
  reset() {
    // Re-initialize with mock data
    this.users = Object.values(mockUsers);
    this.wallets = Object.values(mockWallets);
    this.vehicleTypes = [...mockVehicleTypes];
    this.vehicles = [...mockVehicles];
    this.journeys = [...mockJourneys];
    this.journeyHistories = [...mockJourneyHistories];
    this.carbonCredits = Object.values(mockCarbonCredits);
    this.marketListings = [...mockMarketListings];
    this.bids = [...mockBids];
    this.transactions = [...mockTransactions];
    this.audits = [...mockAudits];
    this.verifyRequests = [...mockVerifyRequests];
    this.images = [...mockImages];
  }

  /**
   * Export all data as JSON (for backup/migration)
   */
  exportData() {
    return {
      users: this.users,
      wallets: this.wallets,
      vehicleTypes: this.vehicleTypes,
      vehicles: this.vehicles,
      journeys: this.journeys,
      journeyHistories: this.journeyHistories,
      carbonCredits: this.carbonCredits,
      marketListings: this.marketListings,
      bids: this.bids,
      transactions: this.transactions,
      audits: this.audits,
      verifyRequests: this.verifyRequests,
      images: this.images,
    };
  }

  /**
   * Import data from JSON (for restore/migration)
   */
  importData(data) {
    if (data.users) this.users = data.users;
    if (data.wallets) this.wallets = data.wallets;
    if (data.vehicleTypes) this.vehicleTypes = data.vehicleTypes;
    if (data.vehicles) this.vehicles = data.vehicles;
    if (data.journeys) this.journeys = data.journeys;
    if (data.journeyHistories) this.journeyHistories = data.journeyHistories;
    if (data.carbonCredits) this.carbonCredits = data.carbonCredits;
    if (data.marketListings) this.marketListings = data.marketListings;
    if (data.bids) this.bids = data.bids;
    if (data.transactions) this.transactions = data.transactions;
    if (data.audits) this.audits = data.audits;
    if (data.verifyRequests) this.verifyRequests = data.verifyRequests;
    if (data.images) this.images = data.images;
  }
}

// Create singleton instance
const mockDatabase = new MockDatabase();

export default mockDatabase;

