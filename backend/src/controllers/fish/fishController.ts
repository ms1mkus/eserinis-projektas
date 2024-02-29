import { Request, Response } from "express";
import { QueryRunner } from "typeorm";
import { User } from "../../entities/user";
import { Fish } from "../../entities/fish";
import { Lake } from "../../entities/lake";
import { CaughtFish } from "../../entities/caughtFish";
import { AppDataSource } from "../../data-source";

const createCaughtFishEntry = async (req: Request, res: Response) => {
  const { fishId, lakeId, caughtAt } = req.body;
  //@ts-ignore
  const userId = req.session?.passport?.user as string;
  if (!userId || !fishId || !lakeId || !caughtAt) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if caughtAt is earlier than 24 hours from now
  // const now = new Date();
  // const caughtDate = new Date(caughtAt);

  // if (now.getTime() - caughtDate.getTime() < 24 * 60 * 60 * 1000) {
  //   return res
  //     .status(400)
  //     .json({ message: "caughtAt date should be at least 24 hours ago" });
  // }

  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);
    const fishRepository = queryRunner.manager.getRepository(Fish);
    const lakeRepository = queryRunner.manager.getRepository(Lake);
    const caughtFishRepository = queryRunner.manager.getRepository(CaughtFish);

    const user = await userRepository.findOneBy({ id: userId });
    const fish = await fishRepository.findOneBy({ id: fishId });
    const lake = await lakeRepository.findOneBy({ id: lakeId });

    if (!user || !fish || !lake) {
      throw new Error("User, Fish, or Lake not found");
    }

    const caughtFish = new CaughtFish();
    caughtFish.user = user;
    caughtFish.fish = fish;
    caughtFish.lake = lake;
    caughtFish.caughtAt = caughtAt;
    await caughtFishRepository.save(caughtFish);

    await queryRunner.commitTransaction();

    res.status(201).json({ message: "Caught fish entry created successfully" });
  } catch (error) {
    if (queryRunner) {
      await queryRunner.rollbackTransaction();
    }

    console.error("Error creating caught fish entry:", error);
    res.status(500).json({ message: "Failed to create caught fish entry" });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

const getFishes = async (req: Request, res: Response) => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const fishRepository = queryRunner.manager.getRepository(Fish);

    const fishes = await fishRepository.find();

    res.status(200).json(fishes);
  } catch (error) {
    console.error("Error fetching fishes:", error);
    res.status(500).json({ message: "Failed to fetch fishes" });
  }
};

export default {
  createCaughtFishEntry,
  getFishes,
};
