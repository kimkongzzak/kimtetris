import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

interface LeaderboardEntry {
  nickname: string;
  score: number;
  date: string;
}

function formatDateWithTime(dateInput?: string | Date): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return String(dateInput);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// In-memory fallback
let globalRecord = {
  highScore: 10000,
  nickname: '김박사',
  topScores: [
    { nickname: '김박사', score: 10000, date: formatDateWithTime() }
  ] as LeaderboardEntry[],
};

// Supabase client instance (if env variables exist)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tetris_scores')
          .select('nickname, score, created_at')
          .order('score', { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          const topScores: LeaderboardEntry[] = data.map((item) => ({
            nickname: item.nickname,
            score: item.score,
            date: formatDateWithTime(item.created_at),
          }));

          return res.status(200).json({
            highScore: topScores[0].score,
            nickname: topScores[0].nickname,
            topScores,
          });
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    }

    return res.status(200).json(globalRecord);
  }

  if (req.method === 'POST') {
    const { nickname, score } = req.body || {};

    if (!nickname || typeof score !== 'number') {
      return res.status(400).json({ error: '유효한 닉네임과 점수가 필요합니다.' });
    }

    const cleanName = String(nickname).trim().slice(0, 12) || '익명';
    const numScore = Math.floor(score);
    const createdAt = new Date().toISOString();
    const formattedDate = formatDateWithTime(createdAt);

    // Try saving to Supabase if configured
    if (supabase) {
      try {
        const { error: insertError } = await supabase
          .from('tetris_scores')
          .insert([
            {
              nickname: cleanName,
              score: numScore,
              created_at: createdAt,
            },
          ]);

        if (insertError) {
          console.error('Supabase insert error:', insertError.message);
        } else {
          // Fetch updated top 10 from Supabase
          const { data } = await supabase
            .from('tetris_scores')
            .select('nickname, score, created_at')
            .order('score', { ascending: false })
            .limit(10);

          if (data && data.length > 0) {
            const topScores: LeaderboardEntry[] = data.map((item) => ({
              nickname: item.nickname,
              score: item.score,
              date: formatDateWithTime(item.created_at),
            }));

            return res.status(200).json({
              success: true,
              globalRecord: {
                highScore: topScores[0].score,
                nickname: topScores[0].nickname,
                topScores,
              },
            });
          }
        }
      } catch (err) {
        console.error('Supabase save error:', err);
      }
    }

    // In-memory fallback if Supabase is not configured or fails
    const newEntry: LeaderboardEntry = {
      nickname: cleanName,
      score: numScore,
      date: formattedDate,
    };

    globalRecord.topScores.push(newEntry);
    globalRecord.topScores.sort((a, b) => b.score - a.score);
    globalRecord.topScores = globalRecord.topScores.slice(0, 10);

    if (numScore > globalRecord.highScore) {
      globalRecord.highScore = numScore;
      globalRecord.nickname = cleanName;
    }

    return res.status(200).json({
      success: true,
      globalRecord,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
