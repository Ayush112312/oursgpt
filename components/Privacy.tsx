
import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="h-full bg-white dark:bg-zinc-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert space-y-6 text-gray-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Commitment</h2>
            <p>
              At OursGPT, your privacy is our top priority. We believe that your digital conversations and creations should remain under your control.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Storage</h2>
            <p>
              All message history, chat threads, and generated images are stored using your browser's <strong>localStorage</strong>. This data never touches our permanent databases. It stays on your device and is cleared only if you choose to clear your browser cache or use the "Clear Data" feature in settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Processing</h2>
            <p>
              When you send a message or request an image, your prompt and any attached visuals are processed by the Google Gemini API to generate a response. Please refer to Google's Privacy Policy for more information on how they handle API requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
            <p>
              We use standard web services to provide basic functionality:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google Gemini API:</strong> For core AI reasoning and generation capabilities.</li>
              <li><strong>Tailwind CSS CDN:</strong> For styling our modern interface.</li>
              <li><strong>Lucide Icons:</strong> For visual navigation elements.</li>
            </ul>
          </section>

          <p className="text-sm border-t border-gray-100 dark:border-zinc-800 pt-6">
            Last Updated: May 2024. For questions, contact privacy@oursgpt.ai
          </p>
        </div>
      </div>
    </div>
  );
};
