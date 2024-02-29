/**
 * Filters customersSuccess that are not away
 * @param {array} customersSuccess
 * @param {array} customersSuccessAway
 * @returns {array} Filtered customersSuccess
 */
function filterAvailableCustomersSuccess(customersSuccess, customersSuccessAway) {
  return customersSuccess.filter(css => !customersSuccessAway.includes(css.id));
}

/**
 * Finds the closest CustomerSuccess for a given customer
 * @param {object} customer
 * @param {array} availableCustomersSuccess
 * @returns {number} Id of the closest CustomerSuccess
 */
function findClosestCustomerSuccessId(customer, availableCustomersSuccess) {
  let closestCustomerSuccessId = 0;
  let minDiff = Infinity;

  availableCustomersSuccess.forEach((css) => {
    const diff = css.score - customer.score;

    if (diff >= 0 && diff < minDiff) {
      minDiff = diff;
      closestCustomerSuccessId = css.id;
    }
  });

  return closestCustomerSuccessId;
}

/**
 * Updates the customerCount for a given CustomerSuccess
 * @param {number} closestCustomerSuccessId
 * @param {array} availableCustomersSuccess
 */
function updateCustomerCount(closestCustomerSuccessId, availableCustomersSuccess) {
  const availableCustomerSuccessIndex = availableCustomersSuccess.findIndex(css => css.id === closestCustomerSuccessId);

  if (availableCustomerSuccessIndex !== -1) {
    if (!availableCustomersSuccess[availableCustomerSuccessIndex].customerCount) {
      availableCustomersSuccess[availableCustomerSuccessIndex].customerCount = 1;
    } else {
      availableCustomersSuccess[availableCustomerSuccessIndex].customerCount += 1;
    }
  }

  return availableCustomersSuccess;
}

/**
 * Finds the CustomerSuccess with the maximum customerCount
 * @param {array} availableCustomersSuccess
 * @returns {number} Id of the CustomerSuccess with the maximum customerCount
 */
function findMaxCustomerCountId(availableCustomersSuccess) {
  let maxCustomerCount = -Infinity;
  let customerSuccessId = 0;

  for (const css of availableCustomersSuccess) {
    if (css?.customerCount && css.customerCount > maxCustomerCount) {
      maxCustomerCount = css.customerCount;
      customerSuccessId = css.id;
    } else if (css?.customerCount && css.customerCount === maxCustomerCount) {
      customerSuccessId = 0;
      break;
    }
  }

  return customerSuccessId;
}

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customersSuccess
 * @param {array} customers
 * @param {array} customersSuccessAway
 */
function customerSuccessBalancing(
  customersSuccess,
  customers,
  customersSuccessAway
) {
  let availableCustomersSuccess = filterAvailableCustomersSuccess(
    customersSuccess,
    customersSuccessAway
  );

  customers.forEach((customer) => {
    const closestCustomerSuccessId = findClosestCustomerSuccessId(
      customer,
      availableCustomersSuccess
    );

    availableCustomersSuccess = updateCustomerCount(closestCustomerSuccessId, availableCustomersSuccess);
  })

  return findMaxCustomerCountId(availableCustomersSuccess);
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 9", () => {
  const css = [{ id: 1, score: 60 }];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 70 },
    { id: 3, score: 20 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 10", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 40 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
    { id: 5, score: 80 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 70 },
    { id: 3, score: 20 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [1, 3, 5];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(2);
})
