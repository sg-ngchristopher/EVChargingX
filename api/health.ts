import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    uptime: typeof process.uptime === 'function' ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
  });
}
