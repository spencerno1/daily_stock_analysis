interface ValidationResult {
  valid: boolean;
  message?: string;
  normalized: string;
}
const SUPPORTED_QUERY_CHARACTERS = /^[A-Z0-9.\u3400-\u9FFF\s]+$/;
const STOCK_CODE_PATTERNS = [
  /^\d{4,6}$/, // Taiwan stock code digits only (e.g. 0050, 2330, 00878)
  /^\d{4,6}\.TW$/, // Taiwan TWSE with suffix (e.g. 2330.TW)
  /^\d{4,6}\.TWO$/, // Taiwan OTC with suffix (e.g. 6488.TWO)
];
export const looksLikeStockCode = (value: string): boolean => {
  const normalized = value.trim().toUpperCase();
  return STOCK_CODE_PATTERNS.some((regex) => regex.test(normalized));
};
export const validateStockCode = (value: string): ValidationResult => {
  const normalized = value.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: '請輸入股票代碼', normalized };
  }
  // Auto-append .TW for pure digit Taiwan stock codes
  const autoNormalized = /^\d{4,6}$/.test(normalized)
    ? normalized + '.TW'
    : normalized;
  const valid = looksLikeStockCode(normalized);
  return {
    valid,
    message: valid ? undefined : '請輸入有效的台股代碼（如 0050、2330）',
    normalized: autoNormalized,
  };
};
export const isObviouslyInvalidStockQuery = (value: string): boolean => {
  const normalized = value.trim().toUpperCase();
  if (!normalized || looksLikeStockCode(normalized)) {
    return false;
  }
  if (!SUPPORTED_QUERY_CHARACTERS.test(normalized)) {
    return true;
  }
  return false;
};
