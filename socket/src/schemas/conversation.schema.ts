import z from "zod";
export const createConversationSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["group", "direct"], {
    required_error: "required conversation type",
  }),
  conversationId: z.string({
    required_error: "required conversation id",
  }),
  members: z.array(
    z.object({
      userId: z.string({
        required_error: "required user id of memeber",
      }),
      role: z.enum(["admin", "member"]),
    })
  ),
});
