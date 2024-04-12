import { Request, Response } from "express";
import { QueryRunner } from "typeorm";
import { AppDataSource } from "../../data-source";

const getLakeInfo = async (req: Request, res: Response) => {
  const { lakeId } = req.params;

  if (!lakeId) {
    return res.status(400).json({ message: "Lake ID is required" });
  }

  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();

    // TODO: Use queryRunner instead of raw SQL
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
    res
      .status(500)
      .json({ message: "Failed to fetch lake info", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

export default {
  getLakeInfo,
};
