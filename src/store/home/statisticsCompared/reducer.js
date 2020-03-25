import { CARD_LOADING } from "../../action";

export const statisticsReducer = (state = { cardLoading: false }, action) => {
  switch (action.type) {
    case CARD_LOADING:
      return { ...state, cardLoading: action.payload };
    default:
      return state;
  }
};
