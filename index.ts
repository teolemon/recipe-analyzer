import { FDCFoodDetails } from './FDCFoodDetails';
import { FDCConfig } from './FDCConfig';

document.addEventListener('DOMContentLoaded', function() {
  const ingredientName = document.getElementById('ingredient');
  const fdcId = (new URL(document.location.href)).searchParams.get('fdcId');
  const url = "https://api.nal.usda.gov/fdc/v1/" + encodeURIComponent(fdcId) + "?api_key=" + FDCConfig.apiKey;
  fetch(url).then((response) => {
    return response.json();
  }).then((json) => {
    const foodDetails = <FDCFoodDetails>json;
    ingredientName.innerHTML = foodDetails.description;
  });
});