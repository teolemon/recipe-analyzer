import { FDCFoodDetails } from './FDCFoodDetails';
import { FDCConfig } from './FDCConfig';
import { convertFDCFoodDetailsToFoodData } from './convertFDCFoodDetailsToFoodData';

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
  });
});