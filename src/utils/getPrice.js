import metal from '../prices/metal.json';
import black from '../prices/black.json';

const getComponentPrice =({
    material = "metal",
    component="shelves",
    subtype = null,
    height = null,
    width = null,
    depth = null
}) =>{
     let key = '';
     let rawPrice = '';

    if(height && width) key = `${height}x${width}`
    else if(height && depth) key = `${height}x${depth}`
    else if(width && depth) key = `${width}x${depth}`

    if(material == 'metal'){
        if(subtype){
            rawPrice = metal[component]?.[subtype]?.[key];
        }else{
            rawPrice =  metal[component]?.[key];
        }
    }
    if(material == 'black'){
        if(subtype){
            rawPrice = black[component]?.[subtype]?.[key];
        }else{
            rawPrice =  black[component]?.[key];
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

export default getComponentPrice