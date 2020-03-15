// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import * as React from 'react';

import { Form, Table, Button } from 'react-bootstrap';
import { IngredientSearcher } from './IngredientSearcher';
import { FoodRef } from '../core/FoodRef';
import { addNutrients } from '../core/Nutrients';

export interface RecipeEditorProps {
  description: string,
  nutrientNames: string[],
  ingredientsList: {
    amount: number,
    unit: string,
    units: string[],
    foodRef: FoodRef | null,
    nutrients: number[],
  }[],
  updateRecipeDescription(value: string): void,
  autocomplete(query: string): Promise<FoodRef[]>,
  addIngredient(foodRef: FoodRef): void,
  updateIngredientAmount(index: number, amount: number): void,
  updateIngredientUnit(index: number, unit: string): void,
  updateIngredientId(index: number, foodRef: FoodRef): void,
}

export const RecipeEditor: React.SFC<RecipeEditorProps> = (props) => {
  return <React.Fragment>
      <Form>
        <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={props.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.updateRecipeDescription(event.target.value)}
              />
        </Form.Group>
      </Form>
      <Form.Label>Ingredients</Form.Label>
      <Table>
        <thead>
          <th>Amount</th>
          <th>Unit</th>
          <th>Ingredient</th>
          <th></th>
          { props.nutrientNames.map(nutrientName => <th>{nutrientName}</th>) }
        </thead>
        <tbody>
          {
            props.ingredientsList.map((ingredient, index) => 
              <tr>
                <td>
                  <Form.Control
                  value={ingredient.amount.toString()}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.updateIngredientAmount(index, Number(event.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                  value={ingredient.unit}
                  as="select"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.updateIngredientUnit(index, event.target.value)}
                  >
                    {ingredient.units.map(unit =><option>{unit}</option>)}
                  </Form.Control>
                </td>
                <td>
                  {/* {
                    ingredient.foodRef ? 
                    <IngredientSearcher
                    key={index}
                    selected={ingredient.foodRef}
                    state={'Selected'}
                    selectFood={(foodRef: FoodRef) => props.updateIngredientId(index, foodRef)}
                    autocomplete={props.autocomplete} />
                    : null
                  } */}
                </td>
                <td><Button>Delete</Button></td>
                { ingredient.nutrients.map(value => <td>{value.toFixed(1)}</td>) }
              </tr>
            )
          }
          <tr>
            <td></td>
            <td></td>
            <td>
              {/* <IngredientSearcher selected={null} state={'Selected'} selectFood={props.addIngredient} autocomplete={props.autocomplete} /> */}
            </td>
            <td><Button>Add</Button></td>
            { props.ingredientsList.map(ingredient => ingredient.nutrients).reduce(addNutrients,  props.nutrientNames.map(() => 0)).map(value => <td>{value.toFixed(1)}</td>) }
          </tr>
        </tbody>
      </Table>
  </React.Fragment>;
}