import type { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

export interface ImageResponse {
  _id: string | Types.ObjectId;
  title: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
