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
import { Recipe, StatusOr, Food } from "../core";
import { Config } from "../config/config";

export interface LoadingState {
  type: "Loading";
}

export interface ErrorState {
  type: "Error";
  message: string;
}

export interface ActiveState {
  type: "Active";
  recipes: Recipe[];
  selectedRecipeIndex: number;
  selectedIngredientIndex: number;
  normalizedFoodsByUrl: { [index: string]: StatusOr<Food> };
  config: Config;
}

export type RootState = LoadingState | ErrorState | ActiveState;
