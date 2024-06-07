import { Request, Response } from "express";
import { QueryRunner } from "typeorm";
import { Lake } from "../../entities/lake";
import { Fish } from "../../entities/fish";
import { CaughtFish } from "../../entities/caughtFish";
import { User } from "../../entities/user";
import { AppDataSource } from "../../data-source";

const getLakeInfo = async (req: Request, res: Response) => {
  const { lakeId } = req.params;

  if (!lakeId) {
    return res.status(400).json({ message: "Lake ID is required" });
  }

  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const lakeRepository = queryRunner.manager.getRepository(Lake);
    const fishRepository = queryRunner.manager.getRepository(Fish);
    const caughtFishRepository = queryRunner.manager.getRepository(CaughtFish);
    const userRepository = queryRunner.manager.getRepository(User);

    // Fetch lake info
    const lake = await lakeRepository.findOneBy({ id: Number(lakeId) });
    if (!lake) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Lake not found" });
    }

    // Fetch fishes with caughtBy users and caughtAt dates
    const fishes: any = await fishRepository
      .createQueryBuilder("fish")
      .leftJoinAndSelect("fish.lake", "lake")
      .leftJoinAndSelect("fish.caughtBy", "caughtBy")
      .leftJoinAndSelect("caughtBy.user", "user")
      .where("lake.id = :lakeId", { lakeId })
      .getMany();

    for (const fish of fishes) {
      const caughtFishEntries = await caughtFishRepository
        .createQueryBuilder("caughtFish")
        .leftJoinAndSelect("caughtFish.user", "user")
        .where("caughtFish.fishId = :fishId", { fishId: fish.id })
        .getMany();

      fish.caughtBy = caughtFishEntries.map((entry) => ({
        username: entry.user.username,
        caughtAt: entry.caughtAt,
      }));
    }

    await queryRunner.commitTransaction();

    res.status(200).json({
      lake,
      fishes,
    });
  } catch (error) {
    console.error("Error fetching lake info:", error);
    await queryRunner?.rollbackTransaction();
    res.status(500).json({ message: "Failed to fetch lake info" });
  } finally {
    await queryRunner?.release();
  }
};

export default {
  getLakeInfo,
};
