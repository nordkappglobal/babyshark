import { z } from "zod";

export const submitResultSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên quá dài"),
  pullups: z.number({ message: "Số lần kéo xà không hợp lệ" }).int().min(0, "Số lần kéo xà không hợp lệ").max(999, "Số lần kéo xà không hợp lệ"),
  captchaCode: z.string().min(1, "Vui lòng nhập mã xác nhận"),
  idempotencyKey: z.string().optional()
});

export type SubmitResultInput = z.infer<typeof submitResultSchema>;
