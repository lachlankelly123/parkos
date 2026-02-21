export async function sendSms(to: string, body: string) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log(`[mock-sms] to=${to} body=${body}`);
    return;
  }
  const twilio = await import("twilio");
  const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body });
}
