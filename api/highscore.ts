import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LeaderboardEntry {
  nickname: string;
  score: number;
  date: string;
}

// Global server in-memory storage (persists during warm lambdas)
let globalRecord = {
  highScore: 10000,
  nickname: 'CYBER_LEGEND',
  topScores: [
    { nickname: 'CYBER_LEGEND', score: 10000, date: new Date().toISOString().split('T')[0] }
  ] as LeaderboardEntry[],
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(globalRecord);
  }

  if (req.method === 'POST') {
    const { nickname, score } = req.body || {};

    if (!nickname || typeof score !== 'number') {
      return res.status(400).json({ error: '유효한 닉네임과 점수가 필요합니다.' });
    }

    const cleanName = String(nickname).trim().slice(0, 12) || '익명';
    const numScore = Math.floor(score);

    const newEntry: LeaderboardEntry = {
      nickname: cleanName,
      score: numScore,
      date: new Date().toISOString().split('T')[0],
    };

    // Update top scores
    globalRecord.topScores.push(newEntry);
    globalRecord.topScores.sort((a, b) => b.score - a.score);
    globalRecord.topScores = globalRecord.topScores.slice(0, 10); // Keep top 10

    // Update global high score if higher
    if (numScore > globalRecord.highScore) {
      globalRecord.highScore = numScore;
      globalRecord.nickname = cleanName;
    }

    return res.status(200).json({
      success: true,
      globalRecord,
    });
  }

  return res.status(45)
    .json({ error: 'Method not allowed' });
}
