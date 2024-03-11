import { Request } from "express";
import { User } from "../../src/entities/user";
import { Fish } from "../../src/entities/fish";
import { Lake } from "../../src/entities/lake";
import { CaughtFish } from "../../src/entities/caughtFish";
import fishController from "../../src/controllers/fish/fishController";
import { AppDataSource } from "../../src/data-source";

jest.mock("../../src/data-source", () => ({
  AppDataSource: {
    createQueryRunner: jest.fn(),
  },
}));

describe("fishController", () => {
  const mockEmptyRequest = {} as Request;
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockQueryRunner = {
    manager: {
      query: jest.fn(),
      getRepository: jest.fn(),
    },
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    connect: jest.fn(),
    startTransaction: jest.fn(),
  };

  beforeEach(() => {
    (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
      mockQueryRunner
    );
  });

  describe("createCaughtFishEntry", () => {
    const mockCaughtFish = new CaughtFish();
    mockCaughtFish.id = 1;

    const mockUser = new User();
    mockUser.id = "1";

    const mockFish = new Fish();
    mockFish.id = 1;

    const mockLake = new Lake();
    mockLake.id = 1;

    const mockRequestWithBody = {
      body: {
        fishId: mockFish.id,
        lakeId: mockLake.id,
        caughtAt: "2022-04-23T12:00:00Z",
      },
      session: { passport: { user: mockUser.id } },
    } as any;

    it("should validate request body and session", async () => {
      const res = mockResponse();
      await fishController.createCaughtFishEntry(
        mockEmptyRequest as any,
        res as any
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing required fields",
      });
    });

    it("should handle errors when fetching user, fish, or lake", async () => {
      const res = mockResponse();
      const mockRequestWithBody = {
        body: {
          fishId: 1,
          lakeId: 1,
          caughtAt: "2022-04-23T12:00:00Z",
        },
        session: { passport: { user: mockUser.id } },
      } as any;

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOneBy: jest.fn().mockResolvedValue(null),
      });

      await fishController.createCaughtFishEntry(
        mockRequestWithBody,
        res as any
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create caught fish entry",
      });
    });

    it("should validate if payload has session id", async () => {
      const res = mockResponse();
      const mockRequestWithBody = {
        body: {
          fishId: mockFish.id,
          lakeId: mockLake.id,
          caughtAt: "2022-04-23T12:00:00Z",
        },
        session: {},
      } as any;

      await fishController.createCaughtFishEntry(
        mockRequestWithBody as any,
        res as any
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Session token is missing or invalid",
      });
    });

    it("should handle errors when fetching user, fish, or lake", async () => {
      const res = mockResponse();
      const mockError = new Error("Test error");

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOneBy: jest.fn().mockRejectedValue(mockError),
      });

      await fishController.createCaughtFishEntry(
        mockRequestWithBody,
        res as any
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create caught fish entry",
      });
    });

    it("should handle errors during transaction and rollback transaction", async () => {
      const res = mockResponse();
      const mockError = new Error("Test error");

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOneBy: jest.fn().mockRejectedValue(mockError),
      });

      await fishController.createCaughtFishEntry(
        mockRequestWithBody,
        res as any
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create caught fish entry",
      });
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it("should successfully create a caught fish entry", async () => {
      const res = mockResponse();

      (mockQueryRunner.manager.getRepository as jest.Mock)
        .mockReturnValueOnce({
          findOneBy: jest.fn().mockResolvedValue(mockUser),
        })
        .mockReturnValueOnce({
          findOneBy: jest.fn().mockResolvedValue(mockFish),
        })
        .mockReturnValueOnce({
          findOneBy: jest.fn().mockResolvedValue(mockLake),
        })
        .mockReturnValueOnce({
          save: jest.fn().mockResolvedValue(mockCaughtFish),
        });

      await fishController.createCaughtFishEntry(
        mockRequestWithBody,
        res as any
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Caught fish entry created successfully",
      });
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe("getFishes", () => {
    const mockFish1 = new Fish();
    mockFish1.id = 1;

    const mockFish2 = new Fish();
    mockFish2.id = 2;

    it("should handle errors when fetching fishes", async () => {
      const res = mockResponse();
      const mockError = new Error("Test error");

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        find: jest.fn().mockRejectedValue(mockError),
      });

      await fishController.getFishes(mockEmptyRequest as any, res as any);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch fishes",
        error: mockError.message,
      });
    });

    it("should return a list of fishes", async () => {
      const mockFishes = [mockFish1, mockFish2];

      const res = mockResponse();
      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue(mockFishes),
      });

      await fishController.getFishes(mockEmptyRequest as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFishes);
    });
  });
});
