"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile-store";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type {
  Activity,
  Award,
  Recommender,
  ActivityCategory,
  LeadershipLevel,
  ImpactScope,
  AwardLevel,
  StrengthRating,
} from "@/types/profile";
import {
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  Trophy,
  Users,
  BookOpen,
  X,
  Check,
} from "lucide-react";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  academic: "Academic",
  arts: "Arts",
  athletics: "Athletics",
  community_service: "Community Service",
  entrepreneurship: "Entrepreneurship",
  leadership: "Leadership",
  research: "Research",
  stem: "STEM",
  writing: "Writing",
  other: "Other",
};

const LEADERSHIP_LABELS: Record<LeadershipLevel, string> = {
  member: "Member",
  active_member: "Active Member",
  board_member: "Board Member",
  vice_president: "Vice President",
  president: "President",
  founder: "Founder",
};

const IMPACT_LABELS: Record<ImpactScope, string> = {
  personal: "Personal",
  club: "Club",
  school: "School",
  local: "Local",
  regional: "Regional",
  state: "State",
  national: "National",
  international: "International",
};

const AWARD_LEVEL_LABELS: Record<AwardLevel, string> = {
  school: "School",
  regional: "Regional",
  state: "State",
  national: "National",
  international: "International",
};

const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

export default function ProfilePage() {
  const {
    profile,
    updateAcademics,
    addActivity,
    updateActivity,
    removeActivity,
    addAward,
    updateAward,
    removeAward,
    addRecommender,
    updateRecommender,
    removeRecommender,
  } = useProfileStore();

  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState(false);
  const [editingAward, setEditingAward] = useState<string | null>(null);
  const [newAward, setNewAward] = useState(false);
  const [editingRecommender, setEditingRecommender] = useState<string | null>(null);
  const [newRecommender, setNewRecommender] = useState(false);

  const [activityDraft, setActivityDraft] = useState<Partial<Activity>>({});
  const [awardDraft, setAwardDraft] = useState<Partial<Award>>({});
  const [recommenderDraft, setRecommenderDraft] = useState<Partial<Recommender>>({});

  const startNewActivity = () => {
    setActivityDraft({
      title: "",
      category: "academic",
      yearsActive: 1,
      weeklyHours: 2,
      leadershipLevel: "member",
      initiativeOwnership: false,
      impactScope: "school",
      measurableOutcomes: "",
    });
    setNewActivity(true);
    setEditingActivity(null);
  };

  const startEditActivity = (act: Activity) => {
    setActivityDraft({ ...act });
    setEditingActivity(act.id);
    setNewActivity(false);
  };

  const saveActivity = () => {
    if (!activityDraft.title) return;
    if (newActivity) {
      addActivity({
        id: generateId(),
        title: activityDraft.title || "",
        category: (activityDraft.category as ActivityCategory) || "other",
        yearsActive: activityDraft.yearsActive || 1,
        weeklyHours: activityDraft.weeklyHours || 2,
        leadershipLevel: (activityDraft.leadershipLevel as LeadershipLevel) || "member",
        initiativeOwnership: activityDraft.initiativeOwnership || false,
        impactScope: (activityDraft.impactScope as ImpactScope) || "school",
        measurableOutcomes: activityDraft.measurableOutcomes || "",
      });
    } else if (editingActivity) {
      updateActivity(editingActivity, activityDraft);
    }
    setNewActivity(false);
    setEditingActivity(null);
    setActivityDraft({});
  };

  const cancelActivityEdit = () => {
    setNewActivity(false);
    setEditingActivity(null);
    setActivityDraft({});
  };

  const startNewAward = () => {
    setAwardDraft({
      title: "",
      level: "school",
      year: new Date().getFullYear(),
      description: "",
    });
    setNewAward(true);
    setEditingAward(null);
  };

  const startEditAward = (award: Award) => {
    setAwardDraft({ ...award });
    setEditingAward(award.id);
    setNewAward(false);
  };

  const saveAward = () => {
    if (!awardDraft.title) return;
    if (newAward) {
      addAward({
        id: generateId(),
        title: awardDraft.title || "",
        level: (awardDraft.level as AwardLevel) || "school",
        year: awardDraft.year || new Date().getFullYear(),
        description: awardDraft.description || "",
      });
    } else if (editingAward) {
      updateAward(editingAward, awardDraft);
    }
    setNewAward(false);
    setEditingAward(null);
    setAwardDraft({});
  };

  const cancelAwardEdit = () => {
    setNewAward(false);
    setEditingAward(null);
    setAwardDraft({});
  };

  const startNewRecommender = () => {
    setRecommenderDraft({
      name: "",
      subject: "",
      strengthRating: 3,
      narrativeAlignmentTag: "",
    });
    setNewRecommender(true);
    setEditingRecommender(null);
  };

  const startEditRecommender = (rec: Recommender) => {
    setRecommenderDraft({ ...rec });
    setEditingRecommender(rec.id);
    setNewRecommender(false);
  };

  const saveRecommender = () => {
    if (!recommenderDraft.name) return;
    if (newRecommender) {
      addRecommender({
        id: generateId(),
        name: recommenderDraft.name || "",
        subject: recommenderDraft.subject || "",
        strengthRating: (recommenderDraft.strengthRating as StrengthRating) || 3,
        narrativeAlignmentTag: recommenderDraft.narrativeAlignmentTag || "",
      });
    } else if (editingRecommender) {
      updateRecommender(editingRecommender, recommenderDraft);
    }
    setNewRecommender(false);
    setEditingRecommender(null);
    setRecommenderDraft({});
  };

  const cancelRecommenderEdit = () => {
    setNewRecommender(false);
    setEditingRecommender(null);
    setRecommenderDraft({});
  };

  const renderActivityForm = () => (
    <div className="p-4 border border-accent/30 rounded-lg bg-accent/5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Activity Title</label>
          <Input
            value={activityDraft.title || ""}
            onChange={(e) => setActivityDraft({ ...activityDraft, title: e.target.value })}
            placeholder="e.g., Robotics Club"
          />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <Select
            value={activityDraft.category || "academic"}
            onChange={(e) =>
              setActivityDraft({ ...activityDraft, category: e.target.value as ActivityCategory })
            }
          >
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className={labelClass}>Leadership Level</label>
          <Select
            value={activityDraft.leadershipLevel || "member"}
            onChange={(e) =>
              setActivityDraft({
                ...activityDraft,
                leadershipLevel: e.target.value as LeadershipLevel,
              })
            }
          >
            {Object.entries(LEADERSHIP_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className={labelClass}>Years Active</label>
          <Input
            type="number"
            min={1}
            max={6}
            value={activityDraft.yearsActive || 1}
            onChange={(e) =>
              setActivityDraft({ ...activityDraft, yearsActive: parseInt(e.target.value) || 1 })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Weekly Hours</label>
          <Input
            type="number"
            min={1}
            max={40}
            value={activityDraft.weeklyHours || 2}
            onChange={(e) =>
              setActivityDraft({ ...activityDraft, weeklyHours: parseInt(e.target.value) || 2 })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Impact Scope</label>
          <Select
            value={activityDraft.impactScope || "school"}
            onChange={(e) =>
              setActivityDraft({ ...activityDraft, impactScope: e.target.value as ImpactScope })
            }
          >
            {Object.entries(IMPACT_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className={labelClass}>Initiative Ownership</label>
          <Select
            value={activityDraft.initiativeOwnership ? "yes" : "no"}
            onChange={(e) =>
              setActivityDraft({ ...activityDraft, initiativeOwnership: e.target.value === "yes" })
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes — I created or own this</option>
          </Select>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Measurable Outcomes</label>
          <Textarea
            className="min-h-[60px]"
            value={activityDraft.measurableOutcomes || ""}
            onChange={(e) =>
              setActivityDraft({ ...activityDraft, measurableOutcomes: e.target.value })
            }
            placeholder="Describe specific, quantifiable results"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={cancelActivityEdit}>
          <X size={14} /> Cancel
        </Button>
        <Button size="sm" onClick={saveActivity}>
          <Check size={14} /> Save
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Structured data input — this feeds all analytics and insights
        </p>
      </div>

      <div className="space-y-6">
        {/* Academics Section */}
        <Card>
          <CardHeader
            title="Academics"
            subtitle="Academic metrics and intended direction"
            action={<GraduationCap size={18} className="text-muted-foreground" />}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>GPA</label>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={4}
                value={profile.academics.gpa}
                onChange={(e) =>
                  updateAcademics({ gpa: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Course Rigor</label>
              <Select
                value={profile.academics.courseRigor}
                onChange={(e) =>
                  updateAcademics({
                    courseRigor: e.target.value as typeof profile.academics.courseRigor,
                  })
                }
              >
                <option value="standard">Standard</option>
                <option value="honors">Honors</option>
                <option value="ap_ib">AP / IB</option>
                <option value="most_demanding">Most Demanding</option>
              </Select>
            </div>
            <div>
              <label className={labelClass}>SAT Score</label>
              <Input
                type="number"
                min={400}
                max={1600}
                value={profile.academics.satScore || ""}
                onChange={(e) =>
                  updateAcademics({
                    satScore: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Optional"
              />
            </div>
            <div>
              <label className={labelClass}>ACT Score</label>
              <Input
                type="number"
                min={1}
                max={36}
                value={profile.academics.actScore || ""}
                onChange={(e) =>
                  updateAcademics({
                    actScore: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Optional"
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Intended Major</label>
              <Input
                value={profile.academics.intendedMajor}
                onChange={(e) =>
                  updateAcademics({ intendedMajor: e.target.value })
                }
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>
        </Card>

        {/* Activities Section */}
        <Card>
          <CardHeader
            title="Activities"
            subtitle={`${profile.activities.length} activities tracked`}
            action={
              <Button size="sm" variant="secondary" onClick={startNewActivity} icon={<Plus size={14} />}>
                Add Activity
              </Button>
            }
          />
          <div className="space-y-3">
            {newActivity && renderActivityForm()}

            {profile.activities.map((act) =>
              editingActivity === act.id ? (
                <div key={act.id}>{renderActivityForm()}</div>
              ) : (
                <div
                  key={act.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-white/40 ring-1 ring-white/25 bg-black/10 hover:border-white/55 hover:ring-white/35 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {act.title}
                      </span>
                      <Badge variant="default">{CATEGORY_LABELS[act.category]}</Badge>
                      <Badge
                        variant={
                          act.leadershipLevel === "founder" || act.leadershipLevel === "president"
                            ? "success"
                            : "outline"
                        }
                      >
                        {LEADERSHIP_LABELS[act.leadershipLevel]}
                      </Badge>
                      {act.initiativeOwnership && (
                        <Badge variant="default">Initiative Owner</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{act.yearsActive} yr{act.yearsActive > 1 ? "s" : ""}</span>
                      <span>{act.weeklyHours} hr/wk</span>
                      <span>{IMPACT_LABELS[act.impactScope]} scope</span>
                    </div>
                    {act.measurableOutcomes && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {act.measurableOutcomes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditActivity(act)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => removeActivity(act.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            )}

            {profile.activities.length === 0 && !newActivity && (
              <EmptyState
                icon={<BookOpen size={32} />}
                title="No activities yet"
                description="Add your extracurricular activities to start building your profile analysis."
                action={
                  <Button size="sm" onClick={startNewActivity} icon={<Plus size={14} />}>
                    Add Your First Activity
                  </Button>
                }
              />
            )}
          </div>
        </Card>

        {/* Awards Section */}
        <Card>
          <CardHeader
            title="Awards & Recognition"
            subtitle={`${profile.awards.length} awards recorded`}
            action={
              <Button size="sm" variant="secondary" onClick={startNewAward} icon={<Plus size={14} />}>
                Add Award
              </Button>
            }
          />
          <div className="space-y-3">
            {newAward && (
              <div className="p-4 border border-accent/30 rounded-lg bg-accent/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Award Title</label>
                    <Input
                      value={awardDraft.title || ""}
                      onChange={(e) => setAwardDraft({ ...awardDraft, title: e.target.value })}
                      placeholder="e.g., USACO Silver Division"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Level</label>
                    <Select
                      value={awardDraft.level || "school"}
                      onChange={(e) =>
                        setAwardDraft({ ...awardDraft, level: e.target.value as AwardLevel })
                      }
                    >
                      {Object.entries(AWARD_LEVEL_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>Year</label>
                    <Input
                      type="number"
                      value={awardDraft.year || new Date().getFullYear()}
                      onChange={(e) =>
                        setAwardDraft({ ...awardDraft, year: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description</label>
                    <Input
                      value={awardDraft.description || ""}
                      onChange={(e) =>
                        setAwardDraft({ ...awardDraft, description: e.target.value })
                      }
                      placeholder="Brief description of the award"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={cancelAwardEdit}>
                    <X size={14} /> Cancel
                  </Button>
                  <Button size="sm" onClick={saveAward}>
                    <Check size={14} /> Save
                  </Button>
                </div>
              </div>
            )}

            {profile.awards.map((award) =>
              editingAward === award.id ? (
                <div key={award.id} className="p-4 border border-accent/30 rounded-lg bg-accent/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={labelClass}>Award Title</label>
                      <Input
                        value={awardDraft.title || ""}
                        onChange={(e) => setAwardDraft({ ...awardDraft, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Level</label>
                      <Select
                        value={awardDraft.level || "school"}
                        onChange={(e) =>
                          setAwardDraft({ ...awardDraft, level: e.target.value as AwardLevel })
                        }
                      >
                        {Object.entries(AWARD_LEVEL_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className={labelClass}>Year</label>
                      <Input
                        type="number"
                        value={awardDraft.year || new Date().getFullYear()}
                        onChange={(e) =>
                          setAwardDraft({ ...awardDraft, year: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Description</label>
                      <Input
                        value={awardDraft.description || ""}
                        onChange={(e) =>
                          setAwardDraft({ ...awardDraft, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={cancelAwardEdit}>
                      <X size={14} /> Cancel
                    </Button>
                    <Button size="sm" onClick={saveAward}>
                      <Check size={14} /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={award.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-white/45 ring-1 ring-white/30 bg-black/10 hover:border-white/60 hover:ring-white/40 transition-colors"
                >
                  <Trophy
                    size={18}
                    className={
                      award.level === "international" || award.level === "national"
                        ? "text-warning"
                        : "text-muted-foreground"
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{award.title}</span>
                      <Badge
                        variant={
                          award.level === "national" || award.level === "international"
                            ? "accent"
                            : "outline"
                        }
                      >
                        {AWARD_LEVEL_LABELS[award.level]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{award.year}</span>
                    </div>
                    {award.description && (
                      <p className="text-xs text-muted-foreground mt-1">{award.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditAward(award)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => removeAward(award.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            )}

            {profile.awards.length === 0 && !newAward && (
              <EmptyState
                icon={<Trophy size={32} />}
                title="No awards yet"
                description="Add your awards and recognitions to strengthen your profile analysis."
                action={
                  <Button size="sm" onClick={startNewAward} icon={<Plus size={14} />}>
                    Add Your First Award
                  </Button>
                }
              />
            )}
          </div>
        </Card>

        {/* Recommenders Section */}
        <Card>
          <CardHeader
            title="Recommenders"
            subtitle={`${profile.recommenders.length} recommenders`}
            action={
              <Button size="sm" variant="secondary" onClick={startNewRecommender} icon={<Plus size={14} />}>
                Add Recommender
              </Button>
            }
          />
          <div className="space-y-3">
            {newRecommender && (
              <div className="p-4 border border-accent/30 rounded-lg bg-accent/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <Input
                      value={recommenderDraft.name || ""}
                      onChange={(e) =>
                        setRecommenderDraft({ ...recommenderDraft, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <Input
                      value={recommenderDraft.subject || ""}
                      onChange={(e) =>
                        setRecommenderDraft({ ...recommenderDraft, subject: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Strength Rating (1-5)</label>
                    <Select
                      value={recommenderDraft.strengthRating || 3}
                      onChange={(e) =>
                        setRecommenderDraft({
                          ...recommenderDraft,
                          strengthRating: parseInt(e.target.value) as StrengthRating,
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} — {n === 1 ? "Weak" : n === 2 ? "Below Average" : n === 3 ? "Average" : n === 4 ? "Strong" : "Exceptional"}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>Narrative Alignment Tag</label>
                    <Input
                      value={recommenderDraft.narrativeAlignmentTag || ""}
                      onChange={(e) =>
                        setRecommenderDraft({
                          ...recommenderDraft,
                          narrativeAlignmentTag: e.target.value,
                        })
                      }
                      placeholder="e.g., Innovation, Leadership"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={cancelRecommenderEdit}>
                    <X size={14} /> Cancel
                  </Button>
                  <Button size="sm" onClick={saveRecommender}>
                    <Check size={14} /> Save
                  </Button>
                </div>
              </div>
            )}

            {profile.recommenders.map((rec) =>
              editingRecommender === rec.id ? (
                <div key={rec.id} className="p-4 border border-accent/30 rounded-lg bg-accent/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Name</label>
                      <input
                        type="text"
                        className="flex h-12 w-full rounded-2xl bg-[var(--color-background)] px-4 py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] shadow-neumorph-inset transition-all duration-300 ease-out focus-visible:outline-none focus-visible:shadow-neumorph-inset-deep focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                        value={recommenderDraft.name || ""}
                        onChange={(e) =>
                          setRecommenderDraft({ ...recommenderDraft, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Subject</label>
                      <input
                        type="text"
                        className="flex h-12 w-full rounded-2xl bg-[var(--color-background)] px-4 py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] shadow-neumorph-inset transition-all duration-300 ease-out focus-visible:outline-none focus-visible:shadow-neumorph-inset-deep focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                        value={recommenderDraft.subject || ""}
                        onChange={(e) =>
                          setRecommenderDraft({ ...recommenderDraft, subject: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Strength Rating (1-5)</label>
                      <select
                        className="flex h-12 w-full rounded-2xl bg-[var(--color-background)] px-4 py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] shadow-neumorph-inset transition-all duration-300 ease-out focus-visible:outline-none focus-visible:shadow-neumorph-inset-deep focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        value={recommenderDraft.strengthRating || 3}
                        onChange={(e) =>
                          setRecommenderDraft({
                            ...recommenderDraft,
                            strengthRating: parseInt(e.target.value) as StrengthRating,
                          })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} — {n === 1 ? "Weak" : n === 2 ? "Below Average" : n === 3 ? "Average" : n === 4 ? "Strong" : "Exceptional"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Narrative Alignment Tag</label>
                      <input
                        type="text"
                        className="flex h-12 w-full rounded-2xl bg-[var(--color-background)] px-4 py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] shadow-neumorph-inset transition-all duration-300 ease-out focus-visible:outline-none focus-visible:shadow-neumorph-inset-deep focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
                        value={recommenderDraft.narrativeAlignmentTag || ""}
                        onChange={(e) =>
                          setRecommenderDraft({
                            ...recommenderDraft,
                            narrativeAlignmentTag: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={cancelRecommenderEdit}>
                      <X size={14} /> Cancel
                    </Button>
                    <Button size="sm" onClick={saveRecommender}>
                      <Check size={14} /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={rec.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{rec.name}</span>
                      <Badge variant="outline">{rec.subject}</Badge>
                      {rec.narrativeAlignmentTag && (
                        <Badge variant="default">{rec.narrativeAlignmentTag}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < rec.strengthRating ? "bg-accent" : "bg-border"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {rec.strengthRating}/5 strength
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditRecommender(rec)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => removeRecommender(rec.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            )}

            {profile.recommenders.length === 0 && !newRecommender && (
              <EmptyState
                icon={<Users size={32} />}
                title="No recommenders yet"
                description="Add your potential recommenders to analyze narrative alignment."
                action={
                  <Button size="sm" onClick={startNewRecommender} icon={<Plus size={14} />}>
                    Add Your First Recommender
                  </Button>
                }
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
