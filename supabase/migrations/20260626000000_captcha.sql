-- Bảng cấu hình hệ thống chung
CREATE TABLE app_settings (
    key text primary key,
    value text not null,
    description text,
    updated_at timestamptz not null default now()
);

-- Bật RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Khởi tạo mã captcha mặc định
INSERT INTO app_settings (key, value, description) 
VALUES ('captcha_code', '123456', 'Mã xác nhận để nộp kết quả kéo xà');

-- Policy cho phép ai cũng có thể đọc (để hiển thị hoặc check trên API nếu cần)
-- Tuy nhiên vì chúng ta check qua API route bằng Admin Client nên không bắt buộc cần policy này. 
-- Nhưng thêm vào để an toàn:
CREATE POLICY "Public can read app_settings" ON app_settings FOR SELECT USING (true);

-- Policy cho phép admin update
CREATE POLICY "Admin can update app_settings" ON app_settings FOR UPDATE USING (
    (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
);
