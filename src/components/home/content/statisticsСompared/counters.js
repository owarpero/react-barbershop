export let countPrices = (snapshot, numOfArr, twoWeeks) => {
  let value = snapshot.val();
  let prices = [];
  let arrOfkeys = [];
  if (value[twoWeeks[2]] !== undefined) {
    arrOfkeys = Object.values(Object.keys(value[twoWeeks[2]]));
  } else {
    arrOfkeys = Object.values(Object.keys(value));
  }

  for (let i = 0; i < twoWeeks[numOfArr].length; i++) {
    const element = arrOfkeys.find(
      el => el === twoWeeks[numOfArr][i].day.toString()
    );

    if (element !== undefined) {
      const sumOfPricesPerDay = () => {
        let price = 0;
        let objectOfDates;

        value[twoWeeks[2]] === undefined
          ? (objectOfDates = value[element])
          : (objectOfDates = value[twoWeeks[2]][element]);

        for (const key in objectOfDates) {
          const element = objectOfDates[key];

          price += element.price;
        }

        return price;
      };
      prices.push(sumOfPricesPerDay());
    } else {
      prices.push(0);
    }
  }

  return prices;
};
export const countRecords = (snapshot, numOfArr, twoWeeks) => {
  let arrOfKeys;
  snapshot.val()[twoWeeks[2]] === undefined
    ? (arrOfKeys = Object.values(Object.keys(snapshot.val())))
    : (arrOfKeys = Object.values(Object.keys(snapshot.val()[twoWeeks[2]])));
  let data = [];
  let pushValue;

  for (let index = 0; index < twoWeeks[numOfArr].length; index++) {
    const el = arrOfKeys.find(
      element => element === twoWeeks[numOfArr][index].day.toString()
    );

    if (el === undefined) {
      data.push(0);
      continue;
    }
    snapshot.val()[twoWeeks[2]] === undefined
      ? (pushValue = snapshot.val()[el])
      : (pushValue = snapshot.val()[twoWeeks[2]][el]);

    data.push(Object.keys(pushValue).length);
  }
  return data;
};
export const recordsCounter = (snapshot, daysInMonth) => {
  const arrOfkeys = Object.values(Object.keys(snapshot.val()));
  const data = [];

  for (let index = 0; index <= daysInMonth; index++) {
    const el = arrOfkeys.find(element => element === index.toString());

    if (el !== undefined) {
      data.push(Object.keys(snapshot.val()[el]).length);
    } else {
      data.push(0);
    }
  }
  return data;
};
export const moneyCounter = (snapshot, daysInMonth) => {
  const arrOfkeys = Object.values(Object.keys(snapshot.val()));
  const date = [];
  for (let index = 0; index <= daysInMonth; index++) {
    const el = arrOfkeys.find(element => element === index.toString());
    if (el !== undefined) {
      const sumOfPricesPerDay = () => {
        let price = 0;
        for (const key in Object.values(snapshot.val()[el])) {
          const element = Object.values(snapshot.val()[el])[key].price;

          element !== undefined ? (price += element) : (price += 0);
        }
        return price;
      };
      date.push(sumOfPricesPerDay());
    } else {
      date.push(0);
    }
  }
  return date;
};
