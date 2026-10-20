export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" style={{ width: size, aspectRatio: 1 }}>
      <path
        d="M64,0 h-6 v30 l-58,-28 v18 l58,28 v4 l-58,-28 v40 h6 v-30 l58,28 v-18 l-58,-28 v-4 l58,28"
        fill="currentColor"
      />
    </svg>
  );
}
