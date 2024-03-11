import { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { isAuthenticated, isUnauthenticated } from "../../src/middlewares/auth";

const mockRequest = {
  isAuthenticated: jest.fn(),
  isUnauthenticated: jest.fn(),
};
const mockResponse = {} as Response;
const mockNext = jest.fn() as NextFunction;

describe("authMiddleware", () => {
  describe("isAuthenticated", () => {
    it("should call next() if user is authenticated", () => {
      mockRequest.isAuthenticated.mockReturnValue(true);

      isAuthenticated(mockRequest as any, mockResponse, mockNext);

      expect(mockRequest.isAuthenticated).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next() with a 403 error if user is not authenticated", () => {
      mockRequest.isAuthenticated.mockReturnValue(false);

      isAuthenticated(mockRequest as any, mockResponse, mockNext);

      expect(mockRequest.isAuthenticated).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining(
          createHttpError(403, "Vartotojas turi būti autentifikuotas")
        )
      );
    });
  });

  describe("isUnauthenticated", () => {
    it("should call next() if user is unauthenticated", () => {
      mockRequest.isUnauthenticated.mockReturnValue(true);

      isUnauthenticated(mockRequest as any, mockResponse, mockNext);

      expect(mockRequest.isUnauthenticated).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next() with a 403 error if user is authenticated", () => {
      mockRequest.isUnauthenticated.mockReturnValue(false);

      isUnauthenticated(mockRequest as any, mockResponse, mockNext);

      expect(mockRequest.isUnauthenticated).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining(
          createHttpError(403, "Vartotojas turi būti ne autentifikuotas")
        )
      );
    });
  });
});
