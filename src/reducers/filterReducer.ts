import { BedroomsKeyEnum } from "../types/enumTypes";
import { ActiveFilters } from "../utils/buildingsFilter";

export type FilterAction =
  | {
      type: "checked" | "unchecked" | "clearAll";
      category: "bedrooms" | "neighborhoods" | "ami";
      checkbox?: BedroomsKeyEnum | string;
    }
  | {
      type: "toggleSwitch";
      category: "isAvailOnly" | "isSavedOnly" | "isAgeRestrictedOnly";
    };

export const filterReducer = (
  state: ActiveFilters,
  action: FilterAction
): ActiveFilters => {
  switch (action.type) {
    case "checked": {
      return {
        ...state,
        [action.category]: new Set(state[action.category]).add(
          action.checkbox!
        ),
      };
    }
    case "unchecked": {
      const newState = new Set(state[action.category]);
      newState.delete(action.checkbox!);
      return {
        ...state,
        [action.category]: newState,
      };
    }
    case "clearAll": {
      return {
        ...state,
        [action.category]: new Set(),
      };
    }
    case "toggleSwitch": {
      return {
        ...state,
        [action.category]: !state[action.category],
      };
    }
    default:
      return state;
  }
};
