const AVATAR_PALETTE = [
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
];

export function avatarColorFor(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[hash];
}
