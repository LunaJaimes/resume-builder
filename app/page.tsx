"use client";

import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

import { useState, type ChangeEvent } from "react";


export default function Home() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");

  const handleOptimize = async () => {
    try {
      setResult("Generating...");

      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume, jobDescription: job }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    }
  };

  function parseResult(text: string) {
    const getSection = (start: string, end: string | null) => {
      const regex = new RegExp(`${start}:([\\s\\S]*?)${end ? end + ":" : "$"}`);
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    return {
      bullets: getSection("IMPROVED RESUME BULLETS", "KEYWORDS TO ADD"),
      keywords: getSection("KEYWORDS TO ADD", "MATCH SCORE"),
      score: getSection("MATCH SCORE", "WHY THIS SCORE"),
      why: getSection("WHY THIS SCORE", "SUGGESTED IMPROVEMENTS"),
      improvements: getSection("SUGGESTED IMPROVEMENTS", null),
    };
  }

  const parsed = parseResult(result);
  const scoreNumber = parseInt(parsed.score)||0;

const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setFileName(file.name);

  try {
    const arrayBuffer = await file.arrayBuffer();

    if (file.type === "application/pdf") {
      const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
      const { text } = await extractText(pdf);
      setResume(text.join("\n"));
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      setResume(result.value);
    } else if (file.type === "text/plain") {
      const text = await file.text();
      setResume(text);
    } else {
      alert("Please upload a PDF, DOCX, or TXT file.");
    }
  } catch (error) {
    console.error(error);
    alert("Could not read this file. Try copying and pasting the text instead.");
  }
};

const cardStyle = {
  background: "white",
  border: "1px solid #f0f0f0",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const headingStyle = {
  fontSize: 17,
  fontWeight: 600,
  marginBottom: 12,
};

const preStyle = {
  whiteSpace: "pre-wrap" as const,
  fontSize: 14,
  color: "#333",
  lineHeight: 1.6,
  fontFamily: "inherit",
  margin: 0,
};



  return (
  <main
    style={{
      minHeight: "100vh",
      padding: "60px",
      background: "#fafafa",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#111",
    }}
  >
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>AI Resume Tailor</h1>

      <p style={{ color: "#666", marginBottom: 40 }}>
        Paste your resume and a job description to generate a tailored, ATS-friendly version.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          marginBottom: 24,
        }}
      >
<div>
  <div style={{ height: 82 }}>
    <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
      Resume
    </label>

    <div style={{ marginBottom: 12 }}>
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 14px",
        border: "1px solid #ddd",
        borderRadius: 999,
        fontSize: 14,
        cursor: "pointer",
        background: "white",
      }}
    >
      Upload File
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleResumeUpload}
        style={{ display: "none" }}
      />
    </label>

    {fileName && (
      <p style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
        {fileName}
      </p>
    )}
  </div>
</div>

  <textarea
    placeholder="Paste your resume here..."
    value={resume}
    onChange={(e) => setResume(e.target.value)}
    style={{
      width: "100%",
      height: 180,
      padding: 16,
      borderRadius: 14,
      border: "1px solid #ddd",
      fontSize: 14,
      resize: "none",
      overflowY: "auto",
      lineHeight: 1.5,
      background: "white",
    }}
  />
</div>


          

        <div> 
  <div style={{ height: 82 }}>
  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
    Job Description
  </label>
  </div>
          
          <textarea
            placeholder="Paste job description here..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
            style={{
              width: "100%",
              height: 180,
              padding: 16,
              borderRadius: 14,
              border: "1px solid #ddd",
              fontSize: 14,
              resize: "none",
              overflowY: "auto",
              lineHeight: 1.5,
              background: "white",
        
            }}
          />
        </div>
      </div>

      <button
        onClick={handleOptimize}
        style={{
          padding: "14px 22px",
          background: "#111",
          color: "white",
          border: "none",
          borderRadius: 999,
          fontSize: 15,
          cursor: "pointer",
          marginBottom: 40,
        }}
      >
        Generate Resume
      </button>

      {result === "Generating..." ? (
        <p>Generating...</p>
      ) : result ? (

        <>
    

    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 20,
      }}
    >

          <div style={cardStyle}>
            <h2 style={headingStyle}>Match Score</h2>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: 300,
                  height: 8,
                  background: "#e5e5e5",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${scoreNumber}%`,
                    height: "100%",
                    background: "#111",
                  }}
                />
              </div>

              <span style={{ color: "#555", fontSize: 14 }}>
                {scoreNumber}%
              </span>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Improved Resume</h2>
            <pre style={preStyle}>{parsed.bullets}</pre>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Keywords to Add</h2>
            <pre style={preStyle}>{parsed.keywords}</pre>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Why This Score</h2>
            <pre style={preStyle}>{parsed.why}</pre>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Suggested Improvements</h2>
            <pre style={preStyle}>{parsed.improvements}</pre>
          </div>
        </section>
        </>
      ) : null}
    </div>
  </main>
);
}