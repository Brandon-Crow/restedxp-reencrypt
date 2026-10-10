"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isValidBattleTag, normalizeBattleTag } from "@/lib/battletag";
import { WOW_FOREVER_GUIDE } from "@/lib/guides";
import { decryptGuideFile, encryptForBattletag } from "@/lib/rxp-crypto";

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function FreeKeyModal() {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDownload = async () => {
    if (!isValidBattleTag(tag)) {
      return setError("Invalid BattleTag. Format: YourName#12345");
    }

    const destinationTag = normalizeBattleTag(tag);
    setError(null);
    setProcessing(true);

    try {
      const response = await fetch(WOW_FOREVER_GUIDE.guideUrl, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("The current WoW Forever guide is unavailable.");
      }

      const raw = await response.text();
      const { plaintext, version } = decryptGuideFile(
        raw,
        WOW_FOREVER_GUIDE.sourceTag,
      );
      const output = encryptForBattletag(plaintext, destinationTag, version);
      const safeTag = destinationTag.replace(/[^a-z0-9]+/gi, "_");
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `wow_forever_guide_${safeTag}.txt`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setCompleted(true);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const tagValid = isValidBattleTag(tag);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError(null);
          setProcessing(false);
          setCompleted(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="wow-btn-free group relative w-full cursor-pointer overflow-hidden rounded-lg px-6 py-3.5 text-sm font-bold tracking-wide">
          <span className="relative z-10 flex items-center justify-center gap-2">
            <DownloadIcon className="h-5 w-5" />
            Generate Your WoW Forever Guide
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="wow-card border-gold-dim/30 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-[var(--font-cinzel)] text-lg tracking-wide text-gold-bright">
            WoW Forever Guide
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your BattleTag to prepare the current guide for your account.
            Processing happens locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="forever-tag"
              className="text-xs font-medium text-gold-dim"
            >
              Your BattleTag
            </Label>
            <Input
              id="forever-tag"
              placeholder="YourName#12345"
              value={tag}
              onChange={(event) => {
                setTag(event.target.value);
                setError(null);
                setCompleted(false);
              }}
              className="wow-input"
              autoFocus
            />
            <Alert className="border-gold-dim/20 bg-gold-dim/5">
              <AlertDescription className="text-xs text-gold-dim">
                The generated file only works with the BattleTag entered here.
                Your BattleTag is not uploaded by this tool.
              </AlertDescription>
            </Alert>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/10"
            >
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border border-gold-dim/15 bg-black/20 p-3">
            <p className="text-sm font-medium text-foreground">
              {WOW_FOREVER_GUIDE.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {WOW_FOREVER_GUIDE.description}
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={!tagValid || processing}
            className="wow-btn-gold w-full cursor-pointer rounded-md px-4 py-2.5 text-sm"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4 animate-spin" />
                Generating...
              </span>
            ) : completed ? (
              <span className="flex items-center justify-center gap-2">
                <CheckIcon className="h-4 w-4" />
                Download Again
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                Generate and Download
              </span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
