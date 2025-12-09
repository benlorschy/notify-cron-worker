import fetch from "node-fetch";

const FUNCTION_URL =
  "https://ibxysdrbvizicrjzxtgd.supabase.co/functions/v1/notify-teacher";

// The shared secret must match what you set in Supabase Env Vars
const CRON_SECRET = process.env.CRON_SECRET;

async function main() {
  console.log("Cron worker starting...");

  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": CRON_SECRET || "" // must match your Edge Function check
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
