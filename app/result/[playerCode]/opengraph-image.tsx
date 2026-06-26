import { ImageResponse } from 'next/og';
import { createAdminServerClient } from "@/lib/supabase/server";
import { maskName } from "@/lib/utils";

export const runtime = 'edge';

// Image metadata
export const alt = 'Baby Shark Challenge Result';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ playerCode: string }> }) {
  const { playerCode } = await params;
  
  const supabase = await createAdminServerClient();
  const { data } = await supabase
    .from("challenge_results")
    .select("full_name, pullups, tier_name")
    .eq("player_code", playerCode)
    .single();

  if (!data) {
    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(to bottom, #0a2540, #1a426f)', color: 'white', fontSize: 64, fontWeight: 'bold'
        }}>
          Baby Shark Challenge
        </div>
      )
    );
  }

  const masked = maskName(data.full_name);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #0a2540, #1a426f)',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.1)', padding: '60px', borderRadius: '32px', border: '2px solid rgba(255,255,255,0.2)' }}>
          <h1 style={{ fontSize: 60, color: '#facc15', marginBottom: 20, textTransform: 'uppercase' }}>
            Baby Shark Challenge
          </h1>
          <p style={{ fontSize: 40, marginBottom: 10 }}>Người chơi: #{playerCode}</p>
          <p style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 40 }}>{masked}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', padding: '30px 60px', borderRadius: '24px', marginBottom: 30 }}>
            <span style={{ fontSize: 100, fontWeight: '900', color: '#00d8ff' }}>{data.pullups} LẦN</span>
          </div>

          <p style={{ fontSize: 40, color: '#a5f3ff' }}>Danh hiệu: {data.tier_name}</p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
