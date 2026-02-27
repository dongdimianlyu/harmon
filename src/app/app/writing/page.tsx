"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile-store";
import {
  analyzeNarrative,
  generateCoherenceLinks,
  detectCliches,
  generateStoryArc,
} from "@/lib/scoring";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Link2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";

export default function WritingStudioPage() {
  const profile = useProfileStore((s) => s.profile);
  const narrative = analyzeNarrative(profile);
  const coherenceLinks = generateCoherenceLinks(profile);
  const storyArc = generateStoryArc(profile);

  const [essayText, setEssayText] = useState("");
  const detectedCliches = essayText.length > 10 ? detectCliches(essayText) : [];

  const arcSteps = [
    { label: "Beginning", content: storyArc.beginning, icon: "01" },
    { label: "Turning Point", content: storyArc.turningPoint, icon: "02" },
    { label: "Growth", content: storyArc.growth, icon: "03" },
    { label: "Future Vision", content: storyArc.futureVision, icon: "04" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Writing Studio</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Narrative coherence analysis and essay intelligence
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Narrative Pillar Detection */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="h-full">
            <CardHeader
              title="Narrative Pillar Detection"
              subtitle="Core identity themes derived from your profile"
              action={<Sparkles size={18} className="text-muted-foreground" />}
            />
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Primary Spike
                </p>
                <div className="px-4 py-3 bg-accent/5 rounded-lg border border-accent/20">
                  <span className="text-base font-bold text-accent">{narrative.primarySpike}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Core Themes
                </p>
                <div className="flex flex-wrap gap-2">
                  {narrative.coreThemes.map((theme) => (
                    <Badge key={theme} variant="default" className="text-sm px-3 py-1">
                      {theme}
                    </Badge>
                  ))}
                  {narrative.coreThemes.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Add activities to detect themes
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Supporting Traits
                </p>
                <div className="space-y-1.5">
                  {narrative.supportingTraits.map((trait) => (
                    <div key={trait} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-success shrink-0" />
                      <span className="text-foreground">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Missing Traits
                </p>
                <div className="space-y-1.5">
                  {narrative.missingTraits.map((trait) => (
                    <div key={trait} className="flex items-center gap-2 text-sm">
                      <XCircle size={14} className="text-danger shrink-0" />
                      <span className="text-muted-foreground">{trait}</span>
                    </div>
                  ))}
                  {narrative.missingTraits.length === 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-success" />
                      <span className="text-foreground">All key traits present</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Coherence Map */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="h-full">
            <CardHeader
              title="Coherence Map"
              subtitle="Connections between activities, themes, and recommenders"
              action={<Link2 size={18} className="text-muted-foreground" />}
            />
            <div className="space-y-3">
              {coherenceLinks.length > 0 ? (
                coherenceLinks.map((link, i) => {
                  const strengthColor =
                    link.strength >= 0.7
                      ? "border-success/30 bg-success/5"
                      : link.strength >= 0.4
                      ? "border-warning/30 bg-warning/5"
                      : "border-danger/30 bg-danger/5";

                  const strengthLabel =
                    link.strength >= 0.7
                      ? "Strong"
                      : link.strength >= 0.4
                      ? "Moderate"
                      : "Weak";

                  const strengthBadge =
                    link.strength >= 0.7
                      ? "success"
                      : link.strength >= 0.4
                      ? "accent"
                      : "default";

                  const typeIcon = (type: string) => {
                    if (type === "activity") return "A";
                    if (type === "theme") return "T";
                    return "R";
                  };

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${strengthColor}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center bg-primary/10 text-primary">
                            {typeIcon(link.sourceType)}
                          </span>
                          <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                            {link.source}
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center bg-accent/10 text-accent">
                            {typeIcon(link.targetType)}
                          </span>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                            {link.target}
                          </span>
                        </div>
                      </div>
                      <Badge variant={strengthBadge as "success" | "accent" | "default"} className="text-[10px] shrink-0">
                        {strengthLabel}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <MinusCircle size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Add activities and recommenders to generate coherence analysis
                  </p>
                </div>
              )}

              {coherenceLinks.length > 0 && (
                <div className="pt-3 border-t border-border mt-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center bg-primary/10 text-primary">
                        A
                      </span>
                      Activity
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center bg-accent/10 text-accent">
                        T
                      </span>
                      Theme
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center bg-primary/10 text-primary">
                        R
                      </span>
                      Recommender
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Cliché Detection */}
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <CardHeader
              title="Cliché Detection"
              subtitle="Paste essay text to scan for overused phrases"
              action={<AlertTriangle size={18} className="text-muted-foreground" />}
            />
            <div className="space-y-4">
              <textarea
                className="w-full px-4 py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[140px] resize-y"
                placeholder="Paste your essay draft here to detect overused phrases and clichés..."
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
              />

              {essayText.length > 10 && (
                <div>
                  {detectedCliches.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-danger uppercase tracking-wide">
                        {detectedCliches.length} cliché{detectedCliches.length > 1 ? "s" : ""} detected
                      </p>
                      {detectedCliches.map((cliche) => (
                        <div
                          key={cliche}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/5 border border-danger/20"
                        >
                          <AlertTriangle size={12} className="text-danger shrink-0" />
                          <span className="text-sm text-foreground">&ldquo;{cliche}&rdquo;</span>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground mt-2">
                        Replace these with specific, personal language that only you could write. Admissions officers read thousands of essays with these exact phrases.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/5 border border-success/20">
                      <CheckCircle2 size={14} className="text-success" />
                      <span className="text-sm text-foreground">
                        No common clichés detected. Your language appears original.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {essayText.length <= 10 && (
                <p className="text-xs text-muted-foreground">
                  Enter at least a few sentences to begin analysis
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Story Arc Mapping */}
        <div className="col-span-12 lg:col-span-7">
          <Card>
            <CardHeader
              title="Story Arc Mapping"
              subtitle="Structured narrative framework based on your profile"
              action={<BookOpen size={18} className="text-muted-foreground" />}
            />
            <div className="space-y-4">
              {arcSteps.map((step, i) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{step.icon}</span>
                    </div>
                    {i < arcSteps.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-foreground mb-1">{step.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Guidance:</span> Use this arc as a structural framework, not a template. Your essay should feel authentic and specific — the best essays reveal how you think, not just what you have done.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
