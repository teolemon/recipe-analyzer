import { createReadStream } from 'fs';
import { join } from 'path';
import { Parser } from 'csv-parse';
import * as admin from 'firebase-admin';

import { FDCConfig } from './FDCConfig';
import { FDCFoodDetails } from './FDCFoodDetails';

function dataFile(filename: string) {
  return join(FDCConfig.usdaDataDirectory, filename + '.csv');
}

function readCsvFile(filename: string, callback: (obj: {[index: string]: string}) => void): Promise<void> {
  console.log('Reading file ' + filename);
  const parser = new Parser({
    delimiter: ',',
  });
  let header: string[] = null;
  let numSkippedRows = 0;
  let numTotalRows = 0;
  return new Promise<void>(resolve => {
    createReadStream(dataFile(filename), {encoding: 'latin1'}).pipe(parser).on('readable', function() {
      let data: string[];
      while (data = this.read()) {
        numTotalRows++;
        if (header == null) {
          header = data;
        } else if (header.length == data.length) {
          let obj: {[index: string]: string} = {};
          for (let columnIndex = 0; columnIndex < header.length; columnIndex++) {
            obj[header[columnIndex]] = data[columnIndex];
          }
          callback(obj);
        } else {
          numSkippedRows++;
        }
      }
    }).on('end', () => {
      console.log('Skipped ' + numSkippedRows + ' rows out of ' + numTotalRows);
      resolve();
    });
  });
}

async function main() {
  let serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  let db = admin.firestore();

  let foodDetailsByFdcId: {[index: string]: FDCFoodDetails} = {};
  await readCsvFile('sr_legacy_food', food => {
    foodDetailsByFdcId[food.fdc_id] = {
      description: null,
      dataType: 'SR Legacy',
      foodNutrients: [],
    };
  });
  await readCsvFile('food', food => {
    let foodDetails = foodDetailsByFdcId[food.fdc_id];
    if (foodDetails != null) {
      foodDetails.description = food.description;
    }
  });
  await readCsvFile('food_portion', foodPortion => {
    let foodDetails = foodDetailsByFdcId[foodPortion.fdc_id];
    if (foodDetails != null) {
      foodDetails.foodPortions = foodDetails.foodPortions || [];
      foodDetails.foodPortions.push({
      modifier: foodPortion.modifier,
      gramWeight: Number(foodPortion.gram_weight),
      amount: Number(foodPortion.amount),
      });
    }
  });
  await readCsvFile('food_nutrient', foodNutrient => {
    let foodDetails = foodDetailsByFdcId[foodNutrient.fdc_id];
    if (foodDetails != null && FDCConfig.nutrients.includes(foodNutrient.nutrient_id)) {
      foodDetails.foodNutrients.push({
          nutrient: {id: Number(foodNutrient.nutrient_id)},
          amount: Number(foodNutrient.amount),
      });
    }
  });

  Object.keys(foodDetailsByFdcId).forEach(fdcId => {
    let docRef = db.collection('usdaFoods').doc(fdcId);
    docRef.set(foodDetailsByFdcId[fdcId]);
  });
}

main();
