import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface User {
  id: string;
  username: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    console.log(token);

    if (!token) {
      res.status(403).json({ Message: "You're not authorized" });
    }
    const user = jwt.verify(
      token as string,
      process.env.API_SECRET as string
    ) as User;
    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
