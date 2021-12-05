import faker from "faker";

import ExternalUser from "../models/Externaluser.js";
import Post from "../models/Post.js";
import { dbTypes } from "./constants.js";
import { randomNumberBetween } from "./utils.js";

const getRandomImage = () => {
  const random = randomNumberBetween(1, 5);

  switch (random) {
    case 1:
      return faker.image.cats();
    case 2:
      return faker.image.avatar();
    case 3:
      return faker.image.animals();
    case 4:
      return faker.image.cats();
    case 5:
      return faker.image.people();
    default:
      return faker.image.people();
  }
};

const getRandomMobile = () => {
  const random = randomNumberBetween(1, 3);

  switch (random) {
    case 1:
      return faker.phone.phoneNumber("9#########");
    case 2:
      return faker.phone.phoneNumber("8#########");
    case 3:
      return faker.phone.phoneNumber("7#########");
    default:
      return faker.phone.phoneNumber("9#########");
  }
};

export const getFakeUserData = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    mobile: getRandomMobile(),
    dbType:
      dbTypes[
        Object.keys(dbTypes)[
          randomNumberBetween(0, Object.keys(dbTypes).length - 1)
        ]
      ],
    address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.state()} ${faker.address.zipCode()}`,
    profileImage: getRandomImage(),
  };
};

export const getFakePostData = () => {
  return {
    title: faker.name.title(),
    desc: faker.lorem.paragraphs(randomNumberBetween(1, 8)),
    date: faker.date.between(new Date(1999 - 1 - 9), new Date()),
    image: randomNumberBetween(0, 4) ? getRandomImage() : "",
  };
};

// export const generateUsers = async () => {
//   for (let i = 0; i < 80; ++i) {
//     const userData = getFakeUserData();

//     const user = new ExternalUser(userData);

//     await user.save();
//   }
// };

// export const generatePosts = async () => {
//   const users = await ExternalUser.find({});
//   if (users.length === 0) return;

//   users.forEach(async (item) => {
//     for (let i = 0; i < randomNumberBetween(0, 19); ++i) {
//       const postdata = getFakePostData();
//       postdata.userId = item._id;
//       const post = new Post(postdata);

//       await post.save();
//     }
//   });
// };
