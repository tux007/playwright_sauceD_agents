export const PRODUCTS = {
  backpack: {
    slug: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
  bikeLight: {
    slug: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
  },
} as const;

export const CHECKOUT_DATA = {
  standard: {
    firstName: 'Max',
    lastName: 'Tester',
    postalCode: '8000',
  },
  problemUser: {
    firstName: 'Max',
    lastName: 'Problem',
    postalCode: '8000',
  },
} as const;
