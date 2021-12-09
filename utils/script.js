import faker from "faker";
import txtgen from "txtgen";

import ExternalUser from "../models/Externaluser.js";
import Post from "../models/Post.js";
import { dbTypes, hateSpeech } from "./constants.js";
import { randomNumberBetween } from "./utils.js";

const getRandomImage = () => {
  const random = randomNumberBetween(1, 4);

  switch (random) {
    case 1:
      return faker.image.cats();
    case 3:
      return faker.image.animals();
    case 2:
      return faker.image.cats();
    case 4:
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

const getRandomDbTypes = () => {
  const dbs = [];

  const count = randomNumberBetween(1, 3);
  for (let i = 0; i < count; ++i) {
    const dbIndex = randomNumberBetween(0, Object.keys(dbTypes).length - 1);
    const db = dbTypes[Object.keys(dbTypes)[dbIndex]];
    if (dbs.findIndex((item) => item == db) < 0) {
      dbs.push(db);
    }
  }
  return dbs;
};

export const getFakeUserData = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLocaleLowerCase(),
    mobile: getRandomMobile(),
    dbTypes: getRandomDbTypes(),
    address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.state()} ${faker.address.zipCode()}`,
    profileImage: getRandomImage(),
  };
};

const generateArticle = () => {
  let article = txtgen.article();
  const articleLength = article.length;
  const hateSpeechLength = hateSpeech.length;

  const willInsert = randomNumberBetween(0, 2);
  if (!willInsert) return article;

  const howMuchToInsert = randomNumberBetween(0, 20);

  for (let i = 0; i < howMuchToInsert; ++i) {
    const randomHateSpeechIndex = randomNumberBetween(0, hateSpeechLength - 1);
    const randomArticleIndex = randomNumberBetween(0, articleLength - 1);

    article =
      article.slice(0, randomArticleIndex) +
      " " +
      hateSpeech[randomHateSpeechIndex] +
      " " +
      article.slice(randomArticleIndex);
  }

  return article;
};

export const getFakePostData = () => {
  return {
    title: faker.name.title(),
    desc: generateArticle(),
    date: faker.date.between(new Date(2012 - 1 - 9), new Date()),
    image: randomNumberBetween(0, 4) ? getRandomImage() : "",
  };
};

export const generateUsers = async () => {
  for (let i = 0; i < 80; ++i) {
    const userData = getFakeUserData();

    const user = new ExternalUser(userData);

    await user.save();
  }
};

export const generatePosts = async () => {
  const users = await ExternalUser.find({});
  if (users.length === 0) return;

  users.forEach(async (user) => {
    for (let i = 0; i < user?.dbTypes?.length; ++i) {
      for (let j = 0; j < randomNumberBetween(0, 19); ++j) {
        const postdata = getFakePostData();
        postdata.userId = user._id;
        postdata.dbType = user.dbTypes[Object.keys(user.dbTypes)[i]];
        const post = new Post(postdata);

        await post.save();
      }
    }
  });
};
