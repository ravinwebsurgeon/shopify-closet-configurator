function getFormattedPrice(formattedPrice) {
    if (!formattedPrice) return "€0,00";
  
    const rawNumber = parseFloat(
      formattedPrice.replace(/[^\d,.-]/g, '').replace(',', '.')
    );
  
    if (isNaN(rawNumber)) return "€0,00";
  
    const total = rawNumber
  
    
    return total
  }

  function getEuroFormattedPrice(price){
    if(price != undefined){
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(price);
    }
  }

  export {getFormattedPrice,getEuroFormattedPrice}