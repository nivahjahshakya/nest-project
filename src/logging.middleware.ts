import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class LogginMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`${req.method} request to ${req.originalUrl}`);
        next();
    }
}