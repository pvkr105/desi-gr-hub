import { site } from "@/data/site";
import type { TargetKind } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

// Best-effort notification to Formspree when a report is filed. Swallows errors
// so that filing a report never fails due to a notification delivery issue.
export async function notifyReportFiled(opts: {
  targetType: TargetKind;
  targetId: string;
  reason: string | null;
}): Promise<void> {
  try {
    const supabase = await createClient();
    // Check if any moderator has notify_on_report enabled.
    const { data: mods } = await supabase
      .from("profiles")
      .select("id")
      .or("(is_admin.eq.true,can_moderate_reports.eq.true)")
      .eq("notify_on_report", true)
      .limit(1);

    if (!mods?.length) return; // No one has notifications enabled, skip.

    // Send a notification to the shared Formspree inbox.
    const response = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: `New report filed: ${opts.targetType}`,
        target_type: opts.targetType,
        target_id: opts.targetId,
        reason: opts.reason || "(no reason provided)",
        message: `A new ${opts.targetType} has been reported.\n\nTarget: ${opts.targetType}/${opts.targetId}\nReason: ${opts.reason || "N/A"}\n\nReview on the admin dashboard at ${site.url}/admin`,
      }),
    });

    if (!response.ok) {
      console.error(`Formspree notification failed: ${response.statusText}`);
    }
  } catch (error) {
    // Swallow all errors — notifying admins is best-effort.
    console.error("Error sending report notification:", error);
  }
}
