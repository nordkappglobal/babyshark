# Baby Shark Challenge (Sunrise Pool)

Mini game marketing app dành cho sự kiện "Thử thách cùng Sunrise - Leo rank xà đơn".

## Tech Stack
- Next.js 14+ (App Router)
- Supabase (PostgreSQL, Auth, RLS, Realtime, RPC)
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod

## Cài đặt (Local Development)

### 1. Requirements
- Node.js 18+

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Supabase
- Tạo project trên [Supabase](https://supabase.com).
- Vào **SQL Editor**, chạy script trong file `supabase/migrations/20260625000000_init.sql` để tạo bảng và function.
- Chạy script trong file `supabase/seed.sql` để tạo danh sách phần thưởng mặc định và 50 user demo.
- Vào **Authentication**, tạo một user với Email/Password bất kỳ (vd: `admin@sunrisepool.vn`).
- Chạy SQL sau trong SQL Editor để set role admin cho user vừa tạo (thay bằng UUID tương ứng):
  ```sql
  INSERT INTO profiles (id, role) VALUES ('<USER_UUID>', 'admin');
  ```

### 4. Biến môi trường
Tạo file `.env.local` ở thư mục gốc:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_BASE_PATH=
```

*(Lưu ý: Không bao giờ commit `SUPABASE_SERVICE_ROLE_KEY` lên public Github).*

### 5. Chạy dự án
```bash
npm run dev
```

Truy cập:
- Public: `http://localhost:3000`
- Bảng xếp hạng: `http://localhost:3000/leaderboard`
- Màn hình TV: `http://localhost:3000/leaderboard/tv`
- Admin: `http://localhost:3000/admin`

## Deploy lên Vercel
1. Push source code lên GitHub.
2. Login Vercel, chọn Import Project từ GitHub.
3. Trong phần **Environment Variables**, thêm 4 biến ở trên.
4. (Tuỳ chọn) Cấu hình Custom Domain: Vercel Dashboard -> Settings -> Domains. Thêm `babyshark.sunrisepool.vn`.

## Test Realtime Leaderboard
1. Mở trang `/leaderboard/tv` ở trình duyệt.
2. Mở cửa sổ ẩn danh, submit một kết quả có số pullups cao (ví dụ: 100).
3. Quay lại trang TV, bạn sẽ thấy dòng xếp hạng mới tự động trượt vào vị trí Top 1 mà không cần F5.
