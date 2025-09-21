import prisma from "@n8n/db";
import {
  credentialsPostSchema,
  credentialsUpdateSchema,
  type CredentialPostInput,
} from "@my-n8n/shared";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import type { Response } from "express";

const createCredential = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate request body against the schema
    const validation = credentialsPostSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.format(),
      });
      return;
    }

    // At this point, we know the data is valid
    const newCreds = validation.data;

    const { title, platform, data } = newCreds;

    const userId = req.userId!;
    const credentials = await prisma.credentials.create({
      data: {
        title,
        platform,
        data,
        userId,
      },
    });

    res.status(200).json({
      message: "Credential created successfully",
      credentials,
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

const getAllCredentials = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const credentials = await prisma.credentials.findMany({
      where: {
        userId: req.userId!,
      },
    });
    res.status(200).json({
      message: "Credentials retrieved successfully",
      credentials,
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

const getCredentialById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const credentials = await prisma.credentials.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Credential retrieved successfully",
      credentials,
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

const updateCredential = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const validation = credentialsUpdateSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.format(),
      });
      return;
    }

    const credentials = await prisma.credentials.update({
      where: {
        id,
      },
      data: validation.data,
    });
    res.status(200).json({
      message: "Credential updated successfully",
      credentials,
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

const deleteCredential = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const credentials = await prisma.credentials.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Credential deleted successfully",
      credentials,
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

export const credentialController = {
  createCredential,
  getAllCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
};
