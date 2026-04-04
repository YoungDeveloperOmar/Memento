import type { DementiaClassification, SupportLevel } from "@/types/memento";

export const supportLevelOptions: Array<{
  value: SupportLevel;
  label: string;
  description: string;
}> = [
  {
    value: "early",
    label: "Early Support",
    description: "Light guidance with reminders and gentle structure.",
  },
  {
    value: "middle",
    label: "Middle Support",
    description: "More frequent prompts with simpler, clearer choices.",
  },
  {
    value: "late",
    label: "Late Support",
    description: "Maximum clarity with urgent escalation and caregiver-first controls.",
  },
];

export const formatSupportLevel = (level: SupportLevel) =>
  supportLevelOptions.find((option) => option.value === level)?.label ?? "Support";

export const dementiaClassificationOptions: Array<{
  value: DementiaClassification;
  label: string;
  description: string;
}> = [
  {
    value: "alzheimers-disease",
    label: "Alzheimer's Disease",
    description: "Most common dementia pattern with progressive memory and orientation changes.",
  },
  {
    value: "vascular-dementia",
    label: "Vascular Dementia",
    description: "Changes linked to reduced blood flow and stepwise shifts in cognition.",
  },
  {
    value: "lewy-body-dementia",
    label: "Lewy Body Dementia",
    description: "Cognition, attention, movement, or visual processing can fluctuate.",
  },
  {
    value: "frontotemporal-dementia",
    label: "Frontotemporal Dementia",
    description: "Often affects behavior, language, and personality earlier.",
  },
  {
    value: "mixed-dementia",
    label: "Mixed Dementia",
    description: "More than one dementia pattern or diagnosis is involved.",
  },
  {
    value: "other",
    label: "Other / Unspecified",
    description: "Use when the diagnosis is still being clarified or differs from the listed types.",
  },
];

export const formatDementiaClassification = (classification: DementiaClassification) =>
  dementiaClassificationOptions.find((option) => option.value === classification)?.label ??
  "Other / Unspecified";

export const formatClockTime = (time: string) => {
  if (!time) {
    return "";
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hours, minutes));
};

export const toTelHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
