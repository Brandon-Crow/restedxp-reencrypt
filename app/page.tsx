import { statSync } from "node:fs";
import { join } from "node:path";
import { FreeKeyModal } from "@/components/free-key-modal";
import { ReEncryptCard } from "@/components/re-encrypt-card";
import { WOW_FOREVER_GUIDE } from "@/lib/guides";

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" />
    </svg>
  );
}

function getGuideUpdatedAt() {
  try {
    const modifiedAt = statSync(
      join(process.cwd(), "public", "guide-wow-forever.txt"),
    ).mtime;

    return {
      dateTime: modifiedAt.toISOString(),
      label: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(modifiedAt),
    };
  } catch {
    return null;
  }
}

export default function Home() {
  const guideUpdatedAt = getGuideUpdatedAt();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090d15]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(55,91,126,0.55),transparent_42%),linear-gradient(to_bottom,rgba(0,0,0,0.15),#090d15_75%)]" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: "url(/bg-leather.jpg)",
          backgroundSize: "600px",
        }}
      />

      <main className="relative z-10 flex flex-col items-center px-4 py-12 md:py-20">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/horde-logo.png"
              alt="Horde"
              className="h-16 w-auto opacity-80 drop-shadow-[0_0_8px_rgba(200,30,30,0.3)] md:h-20"
            />
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-dim md:text-xs">
                Community Guide Tool
              </p>
              <h1 className="font-[var(--font-cinzel)] text-3xl font-bold tracking-wide text-gold-bright md:text-5xl">
                WoW Forever
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Prepare the current guide for your BattleTag
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/alliance-logo.png"
              alt="Alliance"
              className="h-16 w-auto opacity-80 drop-shadow-[0_0_8px_rgba(30,80,200,0.3)] md:h-20"
            />
          </div>
        </header>

        <section className="wow-card mb-6 w-full max-w-lg rounded-xl p-6 text-center md:p-8">
          <CompassIcon className="mx-auto mb-3 h-9 w-9 text-gold" />
          <h2 className="font-[var(--font-cinzel)] text-xl font-semibold tracking-wide text-gold-bright">
            {WOW_FOREVER_GUIDE.title}
          </h2>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-gold-dim/80">
            {guideUpdatedAt ? (
              <>
                Last updated{" "}
                <time dateTime={guideUpdatedAt.dateTime}>
                  {guideUpdatedAt.label}
                </time>
              </>
            ) : (
              "Guide update pending"
            )}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {WOW_FOREVER_GUIDE.description} Enter your BattleTag and the guide
            will be re-encrypted in your browser, ready to download.
          </p>
          <div className="mt-6">
            <FreeKeyModal />
          </div>
        </section>

        <details className="group w-full max-w-lg">
          <summary className="mb-3 cursor-pointer text-center text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            Have another compatible export? Re-encrypt your own file
          </summary>
          <ReEncryptCard />
        </details>

        <section className="mt-12 grid w-full max-w-2xl gap-4 md:grid-cols-2">
          <div className="wow-card rounded-lg p-5">
            <h2 className="font-[var(--font-cinzel)] text-sm font-semibold text-gold-bright">
              Local Processing
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Your BattleTag and custom uploads are processed in your browser.
              The tool does not submit them to an application server.
            </p>
          </div>
          <div className="wow-card rounded-lg p-5">
            <h2 className="font-[var(--font-cinzel)] text-sm font-semibold text-gold-bright">
              Always Current
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The built-in download provides the latest WoW Forever guide made
              available by the site administrator.
            </p>
          </div>
        </section>

        <footer className="mt-12 space-y-2 text-center text-xs text-muted-foreground/50">
          <p>WoW Forever community guide tool</p>
          <p className="text-[10px] text-muted-foreground/30">
            World of Warcraft and Blizzard Entertainment are trademarks of
            Blizzard Entertainment, Inc.
          </p>
        </footer>
      </main>
    </div>
  );
}
