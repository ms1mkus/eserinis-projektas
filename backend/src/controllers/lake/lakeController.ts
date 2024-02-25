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

    //TODO factor to actually queryRunner not raw SQL
    const fishes = await queryRunner.manager.query(
      `select
    fish."name", "user".username, count(*), fish.id
  from
    caught_fish as cf
  inner join fish on
    fish.id = cf."fishId"
  inner join "user" on 
    "user".id = cf."userId" 
  where
    cf."lakeId" = $1
  group by fish.id, "user".username `,
      [lakeId]
    );

    res.status(200).json(fishes);
  } catch (error) {
    console.error("Error fetching lake info:", error);
    res.status(500).json({ message: "Failed to fetch lake info" });
  }
};

export default {
  getLakeInfo,
};
