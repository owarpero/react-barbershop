import { CARD_LOADING } from "../../action";

export const cardLoading = payload => {
  return {
    type: CARD_LOADING,
    payload
  };
};
