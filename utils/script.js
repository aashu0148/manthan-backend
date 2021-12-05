import faker from "faker";

export const getFakeData = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.state()} ${faker.address.zipCode()}`,
    mobile: faker.phone.phoneNumber(),
    image: faker.image.people(),
  };
};
