import { Request, Response } from "express";
import { QueryRunner } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user";
import { Lake } from "../../entities/lake";
import { Like } from "../../entities/like";

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

const likeLake = async (req: Request, res: Response) => {
  const { like, lakeId } = req.body;
  //@ts-ignore
  const userId = req.session?.passport?.user as string;

  if (!lakeId) {
    return res.status(400).json({ message: "Lake ID is required" });
  }

  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();
    const userRepository = queryRunner.manager.getRepository(User);
    const lakeRepository = queryRunner.manager.getRepository(Lake);
    const likeRepository = queryRunner.manager.getRepository(Like);

    const user = await userRepository.findOneOrFail({ where: { id: userId } });
    const lake = await lakeRepository.findOneOrFail({ where: { id: lakeId } });

    if (like) {
      const newLike = new Like();
      newLike.user = user;
      newLike.lake = lake;

      await likeRepository.save(newLike);
    } else {
      await likeRepository.delete({ user, lake });
    }

    res
      .status(200)
      .json({ success: true, message: `Lake ${like ? "liked" : "unliked"}` });
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

export const getLikesByLakeId = async (req: Request, res: Response) => {
  const lakeId = parseInt(req.params.lakeId, 10);
  //@ts-ignore
  const userId = req.session?.passport?.user as string;
  let queryRunner: QueryRunner;

  if (!lakeId) {
    return res.status(400).json({ message: "Lake ID is required" });
  }

  try {
    queryRunner = AppDataSource.createQueryRunner();
    const likeRepository = queryRunner.manager.getRepository(Like);

    const likes = await likeRepository.find({
      where: { lake: { id: lakeId } },
      relations: ["user", "lake"],
    });

    const hasUserLiked = await likeRepository.findOne({
      where: { lake: { id: lakeId }, user: { id: userId } },
    });

    const likedUsers = likes.map((like) => ({
      name: like.user.username,
      avatar: like.user?.imageBlob
        ? like.user.imageBlob.toString("base64")
        : null,
    }));

    return res.status(200).json({
      likedUsers: likedUsers,
      hasUserLiked: Boolean(hasUserLiked),
    });
  } catch (error) {
    console.error("Error fetching like:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch like", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

export const getLakes = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.session?.passport?.user as string;
  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();

    const lakeRepository = queryRunner.manager.getRepository(Lake);

    const lakes = await lakeRepository.find();
    const likes = await queryRunner.manager.query(
      `SELECT l."lakeId" FROM "like" l WHERE l."userId" = $1`,
      [userId]
    );
    const caughtFishes = await queryRunner.manager.query(
      `select "lakeId", array_agg("fishId") as "fishIds"  from caught_fish cf group by cf."lakeId" `
    );

    const caughtFishesMap = {};
    for (const fishes of caughtFishes) {
      caughtFishesMap[fishes.lakeId] = fishes.fishIds;
    }

    const likesSet = new Set(likes.map((like) => like.lakeId));

    const lakesWithLikes = lakes.map((lake) => ({
      ...lake,
      isLiked: Boolean(likesSet.has(lake.id)),
      fishIds: caughtFishesMap[lake.id],
    }));

    res.status(200).json(lakesWithLikes);
  } catch (error) {
    console.error("Error fetching lakes info:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch lakes info", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

export default {
  getLakeInfo,
  likeLake,
  getLikesByLakeId,
  getLakes,
};
