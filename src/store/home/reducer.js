import {
  SIGN_OUT,
  DATA_CHANGED,
  DATA_TRACKING_CHANGED,
  CURRENT_TWO_WEEKS,
  TWO_WEEKS_IN_GRAPH
} from "../action";

export const homeReducer = (state = { date: {}, trackingDate: {} }, action) => {
  switch (action.type) {
    case SIGN_OUT:
      return { ...state };
    case DATA_CHANGED:
      return { ...state, date: action.date };
    case DATA_TRACKING_CHANGED:
      return { ...state, trackingDate: action.date };
    case CURRENT_TWO_WEEKS:
      return { ...state, twoWeeks: action.twoWeeks };
    case TWO_WEEKS_IN_GRAPH:
      return { ...state, twoWeeksInGraph: action.twoWeeks };
    default:
      return state;
  }
};
