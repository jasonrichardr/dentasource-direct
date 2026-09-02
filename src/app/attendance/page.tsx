// /attendance - the DSD attendance tracker (plan 34g), the DentaSource mirror
// of ffcdentalclinicinventory.com/attendance for Jarich + Doc Finn. Access is
// a secret key in the URL (?k=...), checked SERVER-SIDE by the Convex query
// (ATTENDANCE_ACCESS_KEY env on energized-puma-161) - no login, no indexing.
// Data: the console's selfie punches (server-stamped time, geofence verdict,
// ref codes) straight from the events spine.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSD Attendance",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";

const CONVEX_URL = "https://energized-puma-161.convex.cloud";

type Punch = {
  action: "time_in" | "time_out" | null;
  at: number;
  verified: boolean;
  rejectReason: string | null;
  distanceM: number | null;
  refCode: string;
  selfieUrl: string | null;
};
type Deck = {
  day: string;
  serverToday: string;
  branch: string;
  roster: Array<{
    name: string;
    role: string;
    motto: string | null;
    avatarUrl: string | null;
    punches: Punch[];
  }>;
} | null;

async function fetchDeck(accessKey: string, day?: string): Promise<Deck> {
  try {
    const res = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "consoleProfile:publicDeck",
        args: { accessKey, ...(day ? { day } : {}) },
        format: "json",
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { status: string; value: Deck };
    return data.status === "success" ? data.value : null;
  } catch {
    return null;
  }
}

const ROLE_LABEL: Record<string, string> = {
  chair_tech: "Technician",
  sales_rep: "Sales",
  manager: "Operations Manager",
  admin: "Owner",
  showroom_staff: "Showroom",
};

const clock = (ms: number) =>
  new Date(ms).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });

function shiftDay(day: string, delta: number) {
  const d = new Date(`${day}T00:00:00+08:00`);
  d.setUTCDate(d.getUTCDate() + delta);
  return new Date(d.getTime() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string; d?: string }>;
}) {
  const { k, d } = await searchParams;
  const deck = k ? await fetchDeck(k, d) : null;

  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(180deg,#070f1f 0%,#0b1b33 45%,#0d1420 100%)", fontFamily: "'Figtree',-apple-system,'Segoe UI',sans-serif", color: "#e8edf5", padding: "0 0 60px" } as const,
    wrap: { maxWidth: 720, margin: "0 auto", padding: "0 14px" } as const,
    card: { background: "rgba(20,29,46,0.85)", border: "1px solid #243149", borderRadius: 16, padding: 14, marginBottom: 12 } as const,
  };

  if (!deck) {
    return (
      <main style={S.page}>
        <div style={{ ...S.wrap, paddingTop: 120, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>&#128274;</div>
          <h1 style={{ fontFamily: "Georgia,serif", fontWeight: 500, fontSize: 26 }}>DSD Attendance</h1>
          <p style={{ color: "#93a3bd", fontSize: 14.5 }}>
            This door opens with the owner&apos;s key. Ask Sir Jason for the link.
          </p>
        </div>
      </main>
    );
  }

  const isToday = deck.day === deck.serverToday;
  const punched = deck.roster.filter((r) => r.punches.length > 0);
  const absent = deck.roster.filter((r) => r.punches.length === 0 && r.role !== "admin");
  const dateLabel = new Date(`${deck.day}T00:00:00+08:00`).toLocaleDateString("en-PH", {
    weekday: "long", month: "long", day: "numeric", timeZone: "Asia/Manila",
  });

  return (
    <main style={S.page}>
      {/* the sky header */}
      <header style={{ padding: "34px 14px 22px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(1px 1px at 15% 30%,#fff 60%,transparent), radial-gradient(1.5px 1.5px at 70% 20%,#fff 60%,transparent), radial-gradient(1px 1px at 85% 60%,#fff 60%,transparent), radial-gradient(1px 1px at 40% 70%,#fff 55%,transparent)", opacity: 0.5 }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-block", background: "#fff", borderRadius: 12, padding: "8px 14px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/dsd-logo-transparent.png" alt="DentaSource Direct" style={{ height: 34, display: "block" }} />
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontWeight: 500, fontSize: 30, margin: "14px 0 2px" }}>Attendance</h1>
          <div style={{ color: "#e6c76a", fontSize: 12, letterSpacing: 2.2, textTransform: "uppercase", fontWeight: 600 }}>
            {deck.branch}
          </div>
        </div>
      </header>

      <div style={S.wrap}>
        {/* day picker */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <a href={`/attendance?k=${k}&d=${shiftDay(deck.day, -1)}`} style={{ color: "#4d9fec", textDecoration: "none", fontWeight: 700, fontSize: 20, padding: "6px 14px" }}>&#8249;</a>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{dateLabel}</div>
            {!isToday ? (
              <a href={`/attendance?k=${k}`} style={{ color: "#4d9fec", fontSize: 12.5, textDecoration: "none", fontWeight: 600 }}>back to today</a>
            ) : (
              <span style={{ color: "#93a3bd", fontSize: 12.5 }}>today</span>
            )}
          </div>
          {!isToday ? (
            <a href={`/attendance?k=${k}&d=${shiftDay(deck.day, 1)}`} style={{ color: "#4d9fec", textDecoration: "none", fontWeight: 700, fontSize: 20, padding: "6px 14px" }}>&#8250;</a>
          ) : (
            <span style={{ width: 48 }} />
          )}
        </div>

        {/* roster - who punched */}
        {punched.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", color: "#93a3bd" }}>No punches this day.</div>
        ) : null}
        {punched.map((person) => {
          const firstIn = person.punches.find((p) => p.action === "time_in");
          const lastOut = [...person.punches].reverse().find((p) => p.action === "time_out");
          const hours =
            firstIn && lastOut && lastOut.at > firstIn.at
              ? ((lastOut.at - firstIn.at) / 3600000).toFixed(1)
              : null;
          return (
            <section key={person.name} style={S.card}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                {person.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={person.avatarUrl} alt="" style={{ width: 46, height: 46, borderRadius: 999, objectFit: "cover", border: "2px solid #d4af4f" }} />
                ) : (
                  <div style={{ width: 46, height: 46, borderRadius: 999, background: "#241f0f", color: "#d4af4f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 19 }}>
                    {person.name.slice(0, 1)}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{person.name}</div>
                  <div style={{ color: "#93a3bd", fontSize: 12.5 }}>
                    {ROLE_LABEL[person.role] ?? person.role}
                    {person.motto ? <em> - &ldquo;{person.motto}&rdquo;</em> : null}
                  </div>
                </div>
                {hours ? (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#d4af4f" }}>{hours}h</div>
                    <div style={{ fontSize: 10, color: "#93a3bd", letterSpacing: 1 }}>ON SITE</div>
                  </div>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {person.punches.map((p, i) => (
                  <div key={i} style={{ minWidth: 128, background: "#0d1420", borderRadius: 12, border: `1px solid ${p.verified ? "#243149" : "#e8a04c"}`, overflow: "hidden" }}>
                    {p.selfieUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.selfieUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", aspectRatio: "1", background: "#141d2e" }} />
                    )}
                    <div style={{ padding: "7px 9px 9px" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: p.action === "time_in" ? "#34c98e" : "#f2726f" }}>
                        {p.action === "time_in" ? "IN" : "OUT"} {clock(p.at)}
                        {p.verified ? " ✓" : ""}
                      </div>
                      <div style={{ fontSize: 9.5, color: "#5d6d87", marginTop: 2 }}>{p.refCode}</div>
                      {p.distanceM != null ? (
                        <div style={{ fontSize: 9.5, color: "#5d6d87" }}>{p.distanceM}m from showroom</div>
                      ) : null}
                      {!p.verified && p.rejectReason ? (
                        <div style={{ fontSize: 9.5, color: "#e8a04c", marginTop: 2 }}>{p.rejectReason}</div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* who has not punched */}
        {absent.length ? (
          <>
            <h2 style={{ fontSize: 12.5, letterSpacing: 1.4, textTransform: "uppercase", color: "#93a3bd", margin: "20px 2px 8px" }}>
              No punch this day
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {absent.map((person) => (
                <span key={person.name} style={{ background: "rgba(20,29,46,0.85)", border: "1px solid #243149", borderRadius: 999, padding: "8px 14px", fontSize: 13.5, color: "#93a3bd" }}>
                  {person.name}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <footer style={{ marginTop: 34, textAlign: "center", color: "#5d6d87", fontSize: 11.5 }}>
          Selfie punches from the DSD Console - server-stamped time, geofence-verified location, live camera only.
        </footer>
      </div>
    </main>
  );
}
