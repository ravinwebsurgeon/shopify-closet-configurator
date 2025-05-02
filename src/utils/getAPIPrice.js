const getDynamicPrice =({
    priceData,
    material = "metal",
    component="shelves",
    subtype = null,
    height = null,
    width = null,
    depth = null
}) =>{
     let key = '';
     let rawPrice = '';
    if(subtype == 'sliding_partition') key = `${depth}`
    else if(component == "braces") key = `${width}`
    else if(component == 'poles') key = `${height}`
    else if(subtype?.includes("sliding_door_")) key = `${width}`
    else if(height && width) key = `${height}x${width}`
    else if(height && depth) key = `${height}x${depth}`
    else if(width && depth) key = `${width}x${depth}`



    if(material == 'metal'){
        if(subtype){
            rawPrice = priceData[component]?.[subtype]?.[key];
        }else{
            if(component == "topCaps"){
                rawPrice =  priceData[component];
            }else if(component == "foot"){
                rawPrice =  priceData[component];
            }else{
                rawPrice =  priceData[component]?.[key];
            }
            
        }
    }

    if(rawPrice != undefined){
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(rawPrice);
    }

}

export default getDynamicPrice;