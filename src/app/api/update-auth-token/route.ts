import {NextResponse} from 'next/server';
import {setTokenCookie} from "@/lib/firebase/server";

export async function POST(request: Request) {
  const { token } = await request.json();
  await setTokenCookie(token);
  return NextResponse.json({ success: true }, { status: 200 });
}
