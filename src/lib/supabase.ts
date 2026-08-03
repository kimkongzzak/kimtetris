import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite or process env
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const envObj = typeof process !== 'undefined' ? process.env || {} : {};

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || envObj.VITE_SUPABASE_URL || envObj.SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || envObj.VITE_SUPABASE_ANON_KEY || envObj.SUPABASE_ANON_KEY || envObj.SUPABASE_KEY || '';

export interface ScoreRecord {
  id?: number;
  nickname: string;
  score: number;
  created_at?: string;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Format date & time into YYYY-MM-DD HH:mm format
 */
export function formatDateWithTime(dateInput?: string | Date): string {
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

/**
 * Fetch Top High Scores from Supabase DB (Table: tetris_scores)
 */
export async function getTopScoresFromDb(limit: number = 50): Promise<ScoreRecord[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('tetris_scores')
      .select('id, nickname, score, created_at')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('Supabase query failed:', err);
    return [];
  }
}

/**
 * Save new High Score + Nickname + Created At into Supabase DB (Table: tetris_scores)
 */
export async function saveScoreToDb(nickname: string, score: number): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const cleanNick = nickname.trim().slice(0, 12) || '익명';
    const { error } = await supabase
      .from('tetris_scores')
      .insert([
        {
          nickname: cleanNick,
          score: Math.floor(score),
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.warn('Supabase insert error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Supabase save failed:', err);
    return false;
  }
}
