export async function POST() {
  const response = new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );

  // Clear the auth_session cookie
  response.headers.set(
    "Set-Cookie",
    "auth_session=; HttpOnly; Secure; Path=/; Max-Age=0"
  );

  return response;
}

