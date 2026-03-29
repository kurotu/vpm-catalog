export const site = process.env['VERCEL'] ? `https://${process.env['VERCEL_PROJECT_PRODUCTION_URL']}` : undefined;
