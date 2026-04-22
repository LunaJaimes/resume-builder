import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      
      <h1 className="text-4xl font-bold mb-2">
        AI Resume Tailor
      </h1>

      <p className="text-gray-600 mb-8">
        Paste your resume and a job description to generate a tailored version.
      </p>

      <div className="w-full max-w-2xl space-y-4">
        
        <textarea
          placeholder="Paste your resume here..."
          className="w-full h-40 p-3 border rounded-lg"
        />

        <textarea
          placeholder="Paste job description here..."
          className="w-full h-40 p-3 border rounded-lg"
        />

        <button className="w-full bg-black text-white p-3 rounded-lg">
          Generate Resume
        </button>

      </div>

    </main>
  );
}