import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  console.log("conversations:", conversations);
  console.log("error:", error);

  const mappedConversations =
    conversations?.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: new Date(conversation.created_at),
      updatedAt: conversation.updated_at
        ? new Date(conversation.updated_at)
        : undefined,
    })) ?? [];

  return (
  <ChatInterface
    userEmail={user.email ?? ""}
    conversations={mappedConversations}
  />
);
}