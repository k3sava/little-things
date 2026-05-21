"use client";

export interface CollectionHeaderProps {
  title: string;
  description: string;
  count: number;
  accentHex: string;
}

// Multi-theme collection headers (glass/material/metro) removed — brutalist default
// renders the standard h1 in the page layout instead.
export function CollectionHeader(_props: CollectionHeaderProps) {
  return null;
}
