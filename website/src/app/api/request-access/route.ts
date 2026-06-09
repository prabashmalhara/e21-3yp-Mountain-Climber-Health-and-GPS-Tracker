import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const full_name = String(body.full_name || "").trim();
    const organization_name = String(body.organization_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const location = String(body.location || "").trim();
    const expected_device_count = Number(body.expected_device_count || 1);
    const reason = String(body.reason || "").trim();

    if (!full_name || !email || !reason) {
      return NextResponse.json(
        { ok: false, message: "Full name, email, and reason are required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("basecamp_access_requests")
      .insert({
        full_name,
        organization_name,
        email,
        phone,
        location,
        expected_device_count,
        reason,
        status: "pending",
      });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Access request submitted. The project team will verify your request and send an invitation if approved.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Invalid request body.",
      },
      { status: 500 }
    );
  }
}