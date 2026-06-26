"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type LeaderboardEntry = {
  position: number;
  result_id: number;
  player_code: string;
  display_name: string;
  pullups: number;
  tier_name: string;
  created_at: string;
  updated_at: string;
};

export function useLeaderboard(enableRealtime: boolean = true) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();
      if (json.success) {
        setLeaderboard(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    if (!enableRealtime) return;

    const supabase = createClient();

    // Subscribe to leaderboard_sync changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leaderboard_sync',
        },
        (payload) => {
          // Debounce fetch to avoid spamming if multiple updates happen quickly
          setTimeout(() => {
            fetchLeaderboard();
          }, 300);
        }
      )
      .subscribe();

    // Fallback polling every 30s just in case realtime drops
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchLeaderboard, enableRealtime]);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
}
