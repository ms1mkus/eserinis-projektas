import { Request, Response } from "express";
import lakeController from "../../src/controllers/lake/lakeController";
import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entities/user";
import { Lake } from "../../src/entities/lake";
import { Like } from "../../src/entities/like";

//IMPORANT: nepasikliaukit vs code auto importu,
//pvz.: vs code siulys: import { Like } from "/src/entities/like";
//bet "/src/entities/like" neveikia

// kai tikrasis kodas importuoja data-source iš nurodytos direktorijos, tai grąžina mock'intą objektą.
jest.mock("../../src/data-source", () => ({
  AppDataSource: {
    createQueryRunner: jest.fn(),
  },
}));

describe("lakeController", () => {
  // Šitą naudojame kaip konstantą, kad gražiai pamock'inti Response objektą, nuoroda, based on: https://codewithhugo.com/express-request-response-mocking/
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  //Mockinsim visur query runneri irgi
  const mockQueryRunner = {
    manager: {
      query: jest.fn(),
      getRepository: jest.fn(),
    },
    release: jest.fn(),
  };

  describe("getLakeInfo", () => {
    // mockRequest darome kaip kintamąjį ir kiekvieną kartą iš naujo nustatome, nes kai kuriuose unit testuose mes objekto savybes ištriname (pvz.: L37).
    let mockRequest: Partial<Request>;

    beforeEach(() => {
      mockRequest = {
        params: {
          lakeId: "1",
        },
      };

      (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
        mockQueryRunner
      );
    });

    it("should return 400 if lakeId is not provided", async () => {
      delete mockRequest.params.lakeId;
      const res = mockResponse();
      await lakeController.getLakeInfo(mockRequest as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Lake ID is required" });
    });

    it("should fetch and return lake info", async () => {
      const mockFishes = [
        { name: "Fish1", username: "User1", count: 1, id: 1 },
      ];
      const res = mockResponse();
      (mockQueryRunner.manager.query as jest.Mock).mockResolvedValue(
        mockFishes
      );
      await lakeController.getLakeInfo(mockRequest as Request, res as Response);
      expect(mockQueryRunner.manager.query).toHaveBeenCalledWith(
        expect.any(String),
        [mockRequest.params.lakeId]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFishes);
    });

    it("should handle errors", async () => {
      const mockError = new Error("Test error");
      const res = mockResponse();
      (mockQueryRunner.manager.query as jest.Mock).mockRejectedValue(mockError);
      await lakeController.getLakeInfo(mockRequest as Request, res as Response);
      expect(mockQueryRunner.manager.query).toHaveBeenCalledWith(
        expect.any(String),
        [mockRequest.params.lakeId]
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch lake info",
        error: mockError.message,
      });
    });
  });

  describe("likeLake", () => {
    let mockRequest;

    beforeEach(() => {
      mockRequest = {
        body: {
          like: true,
          lakeId: "1",
        },
        session: {
          passport: {
            user: "userId",
          },
        },
      };

      (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
        mockQueryRunner
      );
    });

    it("should return 400 if lakeId is not provided", async () => {
      delete mockRequest.body.lakeId;
      const res = mockResponse();
      await lakeController.likeLake(mockRequest as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Lake ID is required" });
    });

    it("should like a lake", async () => {
      const mockUser = new User();
      const mockLake = new Lake();
      const mockLike = new Like();
      mockLike.user = mockUser;
      mockLike.lake = mockLake;

      const res = mockResponse();
      (mockQueryRunner.manager.getRepository as jest.Mock)
        .mockReturnValueOnce({
          findOneOrFail: jest.fn().mockResolvedValue(mockUser),
        }) // userRepository
        .mockReturnValueOnce({
          findOneOrFail: jest.fn().mockResolvedValue(mockLake),
        }) // lakeRepository
        .mockReturnValueOnce({ save: jest.fn().mockResolvedValue(mockLike) }); // likeRepository

      await lakeController.likeLake(mockRequest as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Lake liked",
      });
    });

    it("should unlike a lake", async () => {
      mockRequest.body.like = false;
      const mockUser = new User();
      const mockLake = new Lake();

      const res = mockResponse();
      (mockQueryRunner.manager.getRepository as jest.Mock)
        .mockReturnValueOnce({
          findOneOrFail: jest.fn().mockResolvedValue(mockUser),
        }) // userRepository
        .mockReturnValueOnce({
          findOneOrFail: jest.fn().mockResolvedValue(mockLake),
        }) // lakeRepository
        .mockReturnValueOnce({ delete: jest.fn().mockResolvedValue({}) }); // likeRepository

      await lakeController.likeLake(mockRequest as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Lake unliked",
      });
    });

    it("should handle errors", async () => {
      const mockUser = new User();
      const mockLake = new Lake();
      const mockError = new Error("Test error");
      const res = mockResponse();

      (mockQueryRunner.manager.getRepository as jest.Mock)
        .mockReturnValueOnce({
          findOneOrFail: jest.fn().mockResolvedValue(mockUser),
        }) // userRepository
        .mockReturnValueOnce({
          findOneOrFail: jest.fn().mockResolvedValue(mockLake),
        }) // lakeRepository
        .mockReturnValueOnce({ save: jest.fn().mockRejectedValue(mockError) }); // likeRepository

      await lakeController.likeLake(mockRequest as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch lake info",
        error: mockError.message,
      });
    });
  });

  describe("getLakes", () => {
    const mockRequest = {};

    beforeEach(() => {
      (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
        mockQueryRunner
      );
    });

    it("should return lakes with a matching `isLiked` tag based on the user's likes", async () => {
      const mockLakes = [
        {
          id: 1,
          name: "Ežeras Vienas",
          area: 250.75,
          depth: 20.5,
          description: "Test 1 ežeras",
          location: { type: "Point", coordinates: [50.0, 30.0] },
          caughtFishes: [],
          likes: [],
        },
        {
          id: 2,
          name: "Ežeras Du",
          area: 300.5,
          depth: 25.0,
          description: "Test 2 ežeras",
          location: { type: "Point", coordinates: [52.0, 32.0] },
          caughtFishes: [],
          likes: [],
        },
        {
          id: 3,
          name: "Ežeras Trys",
          area: 200.25,
          depth: 18.0,
          description: "Test 3 ežeras",
          location: { type: "Point", coordinates: [48.0, 28.0] },
          caughtFishes: [],
          likes: [],
        },
      ];

      const mockLikes = [
        {
          lakeId: 1,
        },
        {
          lakeId: 3,
        },
      ];

      const expectedResult = [
        {
          ...mockLakes[0],
          isLiked: true,
        },
        {
          ...mockLakes[1],
          isLiked: false,
        },
        {
          ...mockLakes[2],
          isLiked: true,
        },
      ];

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue(mockLakes),
      });
      (mockQueryRunner.manager.query as jest.Mock).mockResolvedValue(mockLikes);

      const res = mockResponse();
      await lakeController.getLakes(mockRequest as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe("getLikesByLakeId", () => {
    let mockRequest;

    beforeEach(() => {
      mockRequest = {
        params: {
          lakeId: "1",
        },
        session: {
          passport: {
            user: "userId",
          },
        },
      };

      (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
        mockQueryRunner
      );
    });

    it("should return 400 if lakeId is not provided", async () => {
      delete mockRequest.params.lakeId;
      const res = mockResponse();
      await lakeController.getLikesByLakeId(
        mockRequest as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Lake ID is required" });
    });

    it("should fetch and return likes for a lake", async () => {
      const mockLikes = [
        {
          id: 1,
          user: {
            id: "userId",
            username: "user1",
            imageBlob: Buffer.from("image"),
          },
          lake: {
            id: 1,
          },
        },
        {
          id: 2,
          user: {
            id: "userId",
            username: "user2",
            imageBlob: Buffer.from("image"),
          },
          lake: {
            id: 1,
          },
        },
      ];

      const expectedResult = {
        likedUsers: [
          {
            name: "user1",
            avatar: "aW1hZ2U=",
          },
          {
            name: "user2",
            avatar: "aW1hZ2U=",
          },
        ],
        hasUserLiked: true,
      };

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValueOnce({
        find: jest.fn().mockResolvedValue(mockLikes),
        findOne: jest.fn().mockResolvedValue({ id: "userId" }),
      }); // likeRepository

      const res = mockResponse();
      await lakeController.getLikesByLakeId(
        mockRequest as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    it("should handle errors", async () => {
      const mockError = new Error("Test error");
      const res = mockResponse();

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValueOnce({
        find: jest.fn().mockRejectedValue(mockError),
      }); // likeRepository

      await lakeController.getLikesByLakeId(
        mockRequest as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch like",
        error: mockError.message,
      });
    });
  });
});
