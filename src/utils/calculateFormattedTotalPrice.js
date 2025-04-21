export function calculateFormattedTotalPrice(formattedPrice, quantity) {
    if (!formattedPrice || quantity <= 0) return "€0,00";
  
    const rawNumber = parseFloat(
      formattedPrice.replace(/[^\d,.-]/g, '').replace(',', '.')
    );
  
    if (isNaN(rawNumber)) return "€0,00";
  
    const total = rawNumber * quantity;
  
    
    return total
  }
  