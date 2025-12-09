import fetch from "node-fetch";

const FUNCTION_URL =
  "https://ibxysdrbvizicrjzxtgd.supabase.co/functions/v1/notify-teacher";

// Optional: only needed if your function requires auth.
// If your function does NOT require auth, leave this empty.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

async function main() {
  console.log("Cron worker starting...");

  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SUPABASE_ANON_KEY
          ? { Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
          : {})
      },
      body: JSON.stringify({ source: "render-cron" })
    });

    const text = await res.text();

    console.log("Response code:", res.status);
    console.log("Body:", text);
  } catch (err) {
    console.error("Cron worker error:", err);
  }

  console.log("Cron worker finished.");
}

main();
