export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm text-gray-500">
          VozLend &mdash; AI-powered voice underwriting for alternative lending.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Built with OpenAI Whisper, GPT-4o, and Next.js. Deployed on Vercel.
        </p>
      </div>
    </footer>
  );
}
