import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entities/user";

export interface TestUserAttributes {
  name?: string;
  emailAddress?: string;
  password?: string;
}

export const registerTestUser = async (userDetails?: TestUserAttributes) => {
  const userRepository = AppDataSource.getRepository(User);

  const newUser = new User();
  newUser.username = userDetails?.name || "testinis_vartotojas";
  newUser.email = userDetails?.emailAddress || "testinis_vartotojas@gmail.com";
  newUser.setPassword(userDetails?.password || "slaptazodis");

  await userRepository.save(newUser);
  return newUser;
};
