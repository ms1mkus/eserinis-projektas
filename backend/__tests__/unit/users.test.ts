import { Request } from "express";
import { User } from "../../src/entities/user";
import userController from "../../src/controllers/users/index";
import { AppDataSource } from "../../src/data-source";

jest.mock("../../src/data-source", () => ({
  AppDataSource: {
    createQueryRunner: jest.fn(),
  },
}));

describe("userController", () => {
  const mockEmptyRequest = {} as Request;
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockQueryRunner = {
    manager: {
      getRepository: jest.fn(),
    },
    release: jest.fn(),
  };

  beforeEach(() => {
    (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
      mockQueryRunner
    );
  });

  describe("getProfileById", () => {
    const mockUser = new User();
    mockUser.id = "1";
    mockUser.username = "testUser";
    mockUser.imageBlob = Buffer.from("testImage");

    const mockRequest = {
      session: { passport: { user: mockUser.id } },
    } as any;

    it("should handle user not found", async () => {
      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      const res = mockResponse();
      await userController.getProfileById(mockEmptyRequest as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return user profile", async () => {
      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      const res = mockResponse();
      await userController.getProfileById(mockRequest as any, res as any);

      const imageBase64 = mockUser.imageBlob.toString("base64");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        username: mockUser.username,
        imageBlob: imageBase64,
      });
    });

    it("should handle errors", async () => {
      const mockError = new Error("Test Error");

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockRejectedValue(mockError),
      });

      const res = mockResponse();
      await userController.getProfileById(mockRequest as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch user info",
        error: mockError.message,
      });
    });
  });

  describe("updateProfile", () => {
    const mockUser = new User();
    mockUser.id = "1";
    mockUser.username = "testUser";

    const mockRequestWithUsernameOnly = {
      session: { passport: { user: mockUser.id } },
      body: {
        username: "newUsername",
      },
    } as any;

    const mockRequestWithFile = {
      ...mockRequestWithUsernameOnly,
      file: {
        buffer: Buffer.from("testImage"),
      },
    } as any;

    it("should handle user not found", async () => {
      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      const res = mockResponse();
      await userController.updateProfile(mockEmptyRequest as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should update username", async () => {
      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn(),
      });

      const res = mockResponse();
      await userController.updateProfile(
        mockRequestWithUsernameOnly as any,
        res as any
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        imageBlob: undefined,
      });
    });

    it("should update profile image", async () => {
      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn(),
      });

      const res = mockResponse();
      await userController.updateProfile(
        mockRequestWithFile as any,
        res as any
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        imageBlob: mockRequestWithFile.file.buffer,
      });
    });

    it("should handle when there is not user registered in database", async () => {
      const mockError = new Error("Test Error");

      (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockRejectedValue(mockError),
      });

      const res = mockResponse();
      await userController.updateProfile(
        mockRequestWithUsernameOnly as any,
        res as any
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to update profile",
        error: mockError.message,
      });
    });
  });
});
