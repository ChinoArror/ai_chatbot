// 需要先安装 @vercel/node 依赖
// npm install @vercel/node --save
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Hello from API!' });
}