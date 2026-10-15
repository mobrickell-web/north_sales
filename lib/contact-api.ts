const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ContactMessagePayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

export async function sendContactMessage(payload: ContactMessagePayload) {
  const response = await fetch(`${API_URL}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    throw new Error(
      response.status === 429
        ? "Too many messages sent. Please wait a minute and try again."
        : message || "Your message could not be sent. Please try again.",
    );
  }
}
