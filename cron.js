import fetch from "node-fetch";

console.log("🚨 NEW CRON.JS VERSION RUNNING 🚨");


const TEACHER_FUNCTION_URL =
  "https://ibxysdrbvizicrjzxtgd.supabase.co/functions/v1/notify-teacher";

const STUDENT_FUNCTION_URL =
  "https://ibxysdrbvizicrjzxtgd.supabase.co/functions/v1/process-student-notifications";

// secrets
const CRON_SECRET = process.env.CRON_SECRET;          // for teacher (existing)
const CRON_SECRET_V2 = process.env.CRON_SECRET_V2;    // for student (new)

// Supabase gateway auth (required for your student function)
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function ping(name, url, cronSecret) {
  console.log(`Pinging ${name}:`, url);

  const headers = {
    "Content-Type": "application/json",
    "x-cron-secret": cronSecret || ""
  };

  // Add gateway auth if provided (safe to include for both)
  if (SUPABASE_ANON_KEY) {
    headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
    headers["apikey"] = SUPABASE_ANON_KEY;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ source: "notify-cron-worker" })
  });

  const text = await res.text();
  console.log(`${name} response code:`, res.status);
  console.log(`${name} body:`, text);

  return { status: res.status, body: text };
}

async function main() {
  console.log("Cron worker starting...");

  try {
    // 1) Teacher notifications (existing)
    await ping("notify-teacher", TEACHER_FUNCTION_URL, CRON_SECRET);

    // 2) Student notifications (new)
    await ping("process-student-notifications", STUDENT_FUNCTION_URL, CRON_SECRET_V2);

  } catch (err) {
    console.error("Cron worker error:", err);
  }

  console.log("Cron worker finished.");
}

main();
