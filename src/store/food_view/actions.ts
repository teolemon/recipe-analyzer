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
import { ActionType, Action } from "./types";
import { RootAction, ActionType as RootActionType } from "../types";

function makeRootAction(action: Action): RootAction {
  return { type: RootActionType.UPDATE_FOOD_VIEW_STATE, action };
}

export function setSelectedQuantity(index: number): RootAction {
  return makeRootAction({ type: ActionType.SET_SELECTED_QUANTITY, index });
}