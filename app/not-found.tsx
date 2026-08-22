import { NotFoundGame } from "@/components/mics";

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps the game legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-28 pt-16 md:px-12">
        <NotFoundGame />
      </div>
    </main>
  );
}
