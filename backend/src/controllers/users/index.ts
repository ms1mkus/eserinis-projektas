import type { Response } from "express";
import createHttpError from "http-errors";

import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user";
import type { UsersCreateBody } from "../../types/routes/users";
import { validateCreateBody } from "./validators";
import { QueryRunner } from "typeorm";
import sharp from "sharp";

const create = async (
  req: TypedRequestBody<UsersCreateBody>,
  res: Response
) => {
  const { username, email, password } = validateCreateBody(req.body);

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const usernameExists = await userRepo.exist({
      where: { username },
    });
    if (usernameExists) {
      throw createHttpError(409, "Vartotojo vardas jau užimtas");
    }

    const emailExists = await userRepo.exist({
      where: { email },
    });
    if (emailExists) {
      throw createHttpError(409, "Elektroninis paštas jau užimtas");
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.setPassword(password);
    await queryRunner.manager.save(newUser);

    // No exceptions occured, so we commit the transaction
    await queryRunner.commitTransaction();

    res.send(newUser.id);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

export const getProfileById = async (req, res) => {
  //@ts-ignore
  const userId = req.session?.passport?.user as string;
  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();

    const userRepository = queryRunner.manager.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert imageBlob to base64 string
    const imageBase64 = user?.imageBlob
      ? user.imageBlob.toString("base64")
      : null;

    // Return the user data with the imageBlob as base64
    res.status(200).json({
      id: user.id,
      username: user.username,
      imageBlob: imageBase64,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch user info", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.session?.passport?.user as string;
  let queryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();
    const userRepository = queryRunner.manager.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.file) {
      // Use Sharp to resize and compress the image to 50px
      const resizedImage = await sharp(req.file.buffer)
        .resize(50, 50)
        .toBuffer();

      user.imageBlob = resizedImage;
    }

    await userRepository.update(userId, {
      username: user.username,
      imageBlob: user.imageBlob,
    });

    res.status(200).json({
      imageBlob: user.imageBlob,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

export default {
  create,
  getProfileById,
  updateProfile,
};
