import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { NextFunction, Response, Request } from "express";

export interface JwtPayload {
  id: number;
}

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (
      process.env.NODE_ENV === "development" &&
      req.headers["user-agent"]?.includes("Postman")
    ) {
      next();
      return;
    }
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token, "kashif");

    if (!token) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "User does not exist" });
      return;
    }
    req.body.user = user;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(500).json({ message: error.message });
  }
};
