// Utility functions for input validation

/**
 * Validates and formats phone number input
 * Only allows numbers and max 11 digits
 */
export const handlePhoneInput = (value: string): string => {
  const numericValue = value.replace(/\D/g, ''); // Remove all non-digit characters
  return numericValue.slice(0, 11); // Limit to 11 digits
};

/**
 * Validates email length
 * Max 30 characters
 */
export const validateEmailLength = (value: string): string => {
  return value.slice(0, 30);
};

/**
 * Validates name length
 * Max 30 characters
 */
export const validateNameLength = (value: string): string => {
  return value.slice(0, 30);
};
