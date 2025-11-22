// Utility functions

// Exchange rate: 1 USD = 25,000 VNĐ
export const USD_TO_VND_RATE = 25000;

// Convert USD to VND
export const usdToVnd = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_VND_RATE);
};

// Convert VND to USD
export const vndToUsd = (vndAmount) => {
  return vndAmount / USD_TO_VND_RATE;
};

// Format currency in VNĐ
export const formatCurrency = (amount, currency = 'VND', showSymbol = true) => {
  if (currency === 'VND' || currency === 'VND') {
    // Format VNĐ with Vietnamese number format
    const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(amount));
    return showSymbol ? `${formatted} VNĐ` : formatted;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format currency from USD (convert to VNĐ first)
// Always show VNĐ symbol by default
export const formatCurrencyFromUsd = (usdAmount, showSymbol = true) => {
  const vndAmount = usdToVnd(usdAmount);
  return formatCurrency(vndAmount, 'VND', showSymbol);
};

// Format currency from USD - Always show VNĐ (convenience function)
export const formatVnd = (usdAmount) => {
  return formatCurrencyFromUsd(usdAmount, true);
};

export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default {
  formatCurrency,
  formatDate,
  formatNumber,
  debounce,
  getInitials,
};

