import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { DefaultValues } from "react-hook-form";

/** - 登入`schema` */
export const schema = z.object({
  email: z
    .string({ required_error: "請輸入帳號" })
    .trim()
    .min(1, { message: "請輸入帳號" }),
  password: z
    .string({ required_error: "請輸入密碼" })
    .trim()
    .min(1, { message: "請輸入密碼" }),
  nickname: z
    .string({ required_error: "請輸入暱稱" })
    .trim()
    .min(1, { message: "請輸入暱稱" }),
});

/** - 登入`schema`型別 */
export type SchemaType = z.infer<typeof schema>;

/** - 登入預設值 */
export const defaultValues: DefaultValues<SchemaType> = {};

/** - 登入解析器 */
export const resolver = zodResolver(schema);
