import { notFound } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase/server";
import { maskName } from "@/lib/utils";
import ResultView, { ResultData } from "@/components/game/ResultView";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ playerCode: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { playerCode } = await params;
  
  // We can fetch data here if we want to generate dynamic OpenGraph image later
  // For now, return basic metadata
  return {
    title: `Kết quả - Người chơi #${playerCode} | Baby Shark Challenge`,
    description: `Xem thành tích kéo xà của người chơi #${playerCode} tại Sunrise Pool!`,
  };
}

export default async function ResultPage({ params }: Props) {
  const { playerCode } = await params;
  
  if (!playerCode) {
    notFound();
  }

  const supabase = await createAdminServerClient();
  
  // Fetch result data bypassing RLS
  const { data, error } = await supabase
    .from("challenge_results")
    .select("*")
    .eq("player_code", playerCode)
    .single();

  if (error || !data) {
    console.error("Error fetching result:", error);
    notFound();
  }

  // Hide full name, prepare data for client
  const resultData: ResultData = {
    playerCode: data.player_code,
    maskedName: maskName(data.full_name),
    pullups: data.pullups,
    rankAtSubmission: data.rank_at_submission,
    tierName: data.tier_name,
    rewards: data.rewards || [],
  };

  return <ResultView data={resultData} />;
}
