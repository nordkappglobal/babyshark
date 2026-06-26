-- seed.sql

INSERT INTO achievement_tiers (min_pullups, max_pullups, title, slug, rewards, display_order) VALUES
(0, 4, 'Chưa đạt mốc', 'chua-dat', '[]'::jsonb, 0),
(5, 9, 'Baby Shark', 'baby-shark', '["Tặng 01 vé vào cổng Sunrise"]'::jsonb, 1),
(10, 19, 'Shark Thực tập', 'shark-thuc-tap', '["Tặng 01 vé vào cổng Sunrise", "Tặng 01 chai nước", "Đăng hình lên Fanpage Sunrise công nhận danh hiệu"]'::jsonb, 2),
(20, 29, 'Shark Chiến binh', 'shark-chien-binh', '["Tặng 01 vé vào cổng Sunrise", "Tặng 01 chai nước", "Tặng 05 lon bia G8 Platinum", "Đăng hình lên Fanpage Sunrise công nhận danh hiệu"]'::jsonb, 3),
(30, 39, 'King Shark', 'king-shark', '["Tặng 01 vé vào cổng Sunrise", "Tặng 10 lon bia G8 Platinum", "Đăng hình lên Fanpage Sunrise công nhận danh hiệu"]'::jsonb, 4),
(40, NULL, 'Trùm vịnh SUNRISE', 'trum-vinh-sunrise', '["Tặng 01 vé vào cổng Sunrise", "Tặng 01 thùng bia G8 Platinum", "Đăng hình lên Fanpage Sunrise công nhận danh hiệu"]'::jsonb, 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed some demo records
DO $$
DECLARE
    i INT;
    names TEXT[] := ARRAY['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H', 'Đỗ Văn I', 'Hồ Thị K'];
    demo_name TEXT;
    demo_pullups INT;
BEGIN
    FOR i IN 1..50 LOOP
        demo_name := names[1 + mod(i, 10)] || ' ' || i::text;
        -- Generate random pullups weighted towards lower numbers, but with some high ones
        demo_pullups := floor(random() * 45); 
        
        PERFORM submit_challenge_result(
            demo_name,
            demo_pullups,
            gen_random_uuid()
        );
        -- add small delay by updating created_at later to ensure different timestamps if needed, 
        -- but the loop executes fast. We can just update the created_at to be spread out.
    END LOOP;
    
    -- Spread out timestamps for realistic sorting
    WITH numbered AS (
        SELECT id, row_number() over () as rn FROM challenge_results
    )
    UPDATE challenge_results
    SET created_at = now() - ((50 - numbered.rn) || ' minutes')::interval
    FROM numbered
    WHERE challenge_results.id = numbered.id;
    
    -- Re-calculate ranks and refresh leaderboard since we messed with created_at
    WITH ranked AS (
        SELECT id, row_number() over (order by pullups desc, created_at asc, id asc) as new_rank
        FROM challenge_results WHERE is_active = true AND deleted_at IS NULL
    )
    UPDATE challenge_results
    SET rank_at_submission = ranked.new_rank
    FROM ranked
    WHERE challenge_results.id = ranked.id;
    
    PERFORM refresh_leaderboard_top10();
END $$;
