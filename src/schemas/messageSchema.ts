import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "conent must be of 10 charecters" })
    .max(300, { message: "conent must be ono longer than 300 charecters" }),
});
