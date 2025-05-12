export function calculateFormattedTotalPrice(formattedPrice, quantity ,format= true) {
    if (!formattedPrice || quantity <= 0) return "€0,00";
    let rawNumber = null

    if(format){
       rawNumber = parseFloat(
        formattedPrice.replace(/[^\d,.-]/g, '').replace(',', '.')
      );
    }else{
       rawNumber = formattedPrice;
    }
    
  
    if (isNaN(rawNumber)) return "€0,00";
  
    const total = rawNumber * quantity;
  
    if(format){
      return total
    }
    return parseFloat(total).toFixed(2)
    
  }
  