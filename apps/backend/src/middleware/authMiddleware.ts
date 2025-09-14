import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import prisma from "@n8n/db";

export interface AuthRequest extends Request {
    userId?: string;
    user?: {
        id: string;
        email: string;
    }
}

export const authMiddleware = async (
    req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return;
        }
        const parts = authHeader.split(" ");
        const token = parts[1];
        if (!token) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({
                success: false,
                message: "Server misconfigured: missing JWT secret",
                error: "SERVER_MISCONFIGURED"
            });
            return;
        }

        let decoded: string | JwtPayload;
        try {
            decoded = jwt.verify(token, secret as string);
        } catch (jwtError: any) {
            if (jwtError.name === 'TokenExpiredError') {
                res.status(401).json({
                    success: false,
                    message: "Token has expired",
                    error: "TOKEN_EXPIRED"
                });
                return;
            }
            res.status(401).json({
                success: false,
                message: "Invalid authentication token",
                error: "INVALID_TOKEN"
              });
              return;
            }
        
            const userId = typeof decoded === 'object' && decoded !== null && 'id' in decoded
                ? (decoded as any).id as string
                : undefined;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Invalid authentication token payload",
                    error: "INVALID_TOKEN_PAYLOAD"
                });
                return;
            }

            const user = await prisma.User.findUnique({
              where: { id: userId },
              select: {
                id: true,
                email: true
              }
            });
        
            if (!user) {
              res.status(401).json({
                success: false,
                message: "User not found",
                error: "USER_NOT_FOUND"
              });
              return;
            }
        
            req.userId = user.id;
            req.user = {
              ...user
            };
            
            next();
        
       
        }catch (e) {
             res.status(401).json({
                message: "Unauthorized"
             })
             return;
        }
    }