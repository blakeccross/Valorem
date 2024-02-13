import { Database } from "../../../../types/supabase";
import { cookies, headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
// type User = Database['public']['Tables']['users']['Row'];

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      // const supabase = createRouteHandlerClient<Database>({ cookies });
      const { email }: { email: string } = await req.json();

      const { data, error } = await supabase.auth.admin.generateLink({
        type: "invite",
        email: email,
      });

      return new Response(JSON.stringify(data), {
        status: 200,
      });
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify({ error: { statusCode: 500, message: err.message } }), {
        status: 500,
      });
    }
  }
}
