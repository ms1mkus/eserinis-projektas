import { Request, Response } from "express";
import { QueryRunner } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user";
import { Lake } from "../../entities/lake";
import { Comment } from "../../entities/comment";

const postComment = async (req: Request, res: Response) => {
  const { message, lakeId } = req.body;
  //@ts-ignore
  const userId = req.session?.passport?.user as string;

  console.log(req.body);

  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();

    const userRepository = queryRunner.manager.getRepository(User);
    const lakeRepository = queryRunner.manager.getRepository(Lake);
    const commentRepository = queryRunner.manager.getRepository(Comment);

    const user = await userRepository.findOneOrFail({ where: { id: userId } });
    const lake = await lakeRepository.findOneOrFail({ where: { id: lakeId } });

    const comment = new Comment();
    comment.user = user;
    comment.lake = lake;
    comment.message = message;

    await commentRepository.save(comment);

    res.status(201).json({ message: "Caught fish entry created successfully" });
  } catch (error) {
    console.error("Error posting comment:", error);
    res
      .status(500)
      .json({ message: "Failed to post comment:", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

const getLakeComments = async (req: Request, res: Response) => {
  const { lakeId } = req.params;

  if (!lakeId) {
    return res.status(400).json({ message: "Lake ID is required" });
  }

  let queryRunner: QueryRunner;

  try {
    queryRunner = AppDataSource.createQueryRunner();

    const comments = await queryRunner.manager.query(
      `select u."imageBlob", u.username, message  from "comment" inner join "user" u ON u.id = "userId"  where "lakeId" = $1 order by "comment".id desc`,
      [lakeId]
    );

    comments.map((c) => ({ ...c, imageBlob: c.imageBlob.toString("base64") }));

    res.status(200).json(
      comments.map((c) => ({
        ...c,
        imageBlob: c.imageBlob.toString("base64"),
      }))
    );
  } catch (error) {
    console.error("Error fetching lake comments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch lake comments", error: error.message });
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

export default {
  postComment,
  getLakeComments,
};
