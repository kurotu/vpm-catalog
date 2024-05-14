export default async function handler(
  request, response,
) {
  const authHeader = request.headers.authorization;
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ success: false });
  }

  if (!process.env.BUILD_HOOK_URL) {
    return response.status(500).json({ success: false });
  }

  await fetch(process.env.BUILD_HOOK_URL, { method: "POST" });
  return response.status(200).json({ success: true });
}
