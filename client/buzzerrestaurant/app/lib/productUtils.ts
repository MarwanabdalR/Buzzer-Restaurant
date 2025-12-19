export const calculateDiscount = (price: string, originalPrice?: string | null): number | null => {
  if (!originalPrice) return null;
  const priceNum = parseFloat(price);
  const originalNum = parseFloat(originalPrice);
  if (originalNum > priceNum) {
    const discount = ((originalNum - priceNum) / originalNum) * 100;
    return Math.round(discount);
  }
  return null;
};

