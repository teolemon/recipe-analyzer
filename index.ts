import { FDCFoodDetails } from './FDCFoodDetails';
import { FDCConfig } from './FDCConfig';
import { convertFDCFoodDetailsToFoodData } from './convertFDCFoodDetailsToFoodData';
import { Quantity } from './nutrients';

function printQuantity(quantity: Quantity): string {
  return quantity.amount.toPrecision(4) + ' ' + quantity.unit;
}

document.addEventListener('DOMContentLoaded', function() {
  const fdcId = (new URL(document.location.href)).searchParams.get('fdcId');
  const url = "https://api.nal.usda.gov/fdc/v1/" + encodeURIComponent(fdcId) + "?api_key=" + FDCConfig.apiKey;
  fetch(url).then((response) => {
    return response.json();
  }).then((json) => {
    const foodData = convertFDCFoodDetailsToFoodData(<FDCFoodDetails>json);
    document.getElementById('ingredient').innerText = foodData.description;
    document.getElementById('calories').innerText = foodData.nutrientsPerServing['calories'].toFixed(0);
    document.getElementById('protein').innerText = foodData.nutrientsPerServing['protein'].toFixed(0);
    const measuresTableBody = document.getElementById('measures');
    const servingEquivalentQuantities = foodData.servingEquivalentQuantities;
    
    let servingSize: Quantity = {amount: 1.0, unit: 'serving'};
    if ('g' in servingEquivalentQuantities) {
      servingSize = {amount: servingEquivalentQuantities['g'], unit: 'g'};
    } else if ('ml' in servingEquivalentQuantities) {
      servingSize = {amount: servingEquivalentQuantities['ml'], unit: 'ml'};
    }
    document.getElementById('serving-size').innerText = printQuantity(servingSize)
    
    Object.keys(servingEquivalentQuantities).sort().forEach(unit => {
      if (unit == servingSize.unit) {
        return;
      }
      // amount, unit is equal to 1 serving.  Rearrange to express unit in
      // terms of servingSize.unit.  That is
      // amount x unit = one serving = servingSize.amount x servingSize.unit
      // therefore
      // unit = (servingSize.amount / amount) x servingSize.unit
      let amount = servingEquivalentQuantities[unit];
      let unitQuantity = {
        amount: 1,
        unit: unit,
      }
      let unitEquivalentQuantity = {
        amount: servingSize.amount / amount,
        unit: servingSize.unit,
      }
      let unitCell = document.createElement('td');
      unitCell.innerText = printQuantity(unitQuantity);
      let equivalentCell = document.createElement('td');
      equivalentCell.innerText = printQuantity(unitEquivalentQuantity);
      let row = document.createElement('tr');
      row.appendChild(unitCell);
      row.appendChild(equivalentCell);
      measuresTableBody.appendChild(row);
    });
  });
});