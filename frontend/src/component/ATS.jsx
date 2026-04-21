import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

/* ✅ PDF Worker FIX */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function ATS() {
  const [score, setScore] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  /* Extract text from PDF */
  const extractTextFromPDF = async (file) => {
    try {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;

          let textContent = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str);
            textContent += strings.join(" ");
          }

          analyzeResume(textContent);
        } catch (err) {
          console.error("PDF Error:", err);
          alert("Failed to read PDF ❌");
          setLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("File Error:", err);
      alert("File processing failed ❌");
      setLoading(false);
    }
  };

  /* AI Analysis */
  const analyzeResume = async (resumeText) => {
    const finalJD =
      jobDescription.trim() || "General software developer role";

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `
Compare this resume with the job description.

Return response EXACTLY in format:

Score: number between 0 and 100

Missing Skills:
(list)

Suggestions:
(list)

Resume:
${resumeText}

Job Description:
${finalJD}
`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = response.data.choices[0].message.content;

      // Score
      const scoreMatch = text.match(/Score:\s*(\d+)/i);
      setScore(scoreMatch ? Number(scoreMatch[1]) : 50);

      // Missing Skills
      const missingSkillsMatch = text.match(
        /Missing Skills:\s*([\s\S]*?)Suggestions:/i
      );

      if (missingSkillsMatch) {
        const skills = missingSkillsMatch[1]
          .split("\n")
          .map((s) => s.replace("-", "").trim())
          .filter(Boolean);

        setMissingSkills(skills);
      }

      // Suggestions
      const suggestionsMatch = text.match(/Suggestions:\s*([\s\S]*)/i);

      if (suggestionsMatch) {
        const tips = suggestionsMatch[1]
          .split("\n")
          .map((s) => s.replace("-", "").trim())
          .filter(Boolean);

        setSuggestions(tips);
      }
    } catch (err) {
      console.error("AI Error:", err);
      alert("AI request failed ❌");
    }

    setLoading(false);
  };

  /* Upload */
  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Upload PDF only");
      return;
    }

    // Preview
    const fileURL = URL.createObjectURL(file);
    setPdfUrl(fileURL);

    setLoading(true);
    extractTextFromPDF(file);
  };

  return (
    <div className="min-h-screen bg-[#f3f8f6] text-black p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        SmartHire ATS
      </h1>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Score</p>
          <h2 className="text-xl font-bold text-green-500">
            {score || 0}%
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Missing Skills</p>
          <h2 className="text-xl font-bold text-red-500">
            {missingSkills.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Suggestions</p>
          <h2 className="text-xl font-bold text-blue-500">
            {suggestions.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Status</p>
          <h2 className="text-xl font-bold text-green-600">
            {score > 70 ? "Good" : "Improve"}
          </h2>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT → PDF */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">
            Resume Preview
          </h2>

          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="PDF"
              className="w-full h-[500px] border rounded"
            ></iframe>
          ) : (
            <p className="text-gray-500">
              Upload PDF to preview
            </p>
          )}
        </div>

        {/* RIGHT → ANALYSIS */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">
            Upload & Analysis
          </h2>

          <textarea
            placeholder="Job Description (Optional)"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-28 border p-2 rounded mb-3"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="mb-3"
          />

          {loading && (
            <p className="text-gray-500">Analyzing...</p>
          )}

          {score !== null && (
            <>
              <h1 className="text-3xl font-bold text-green-500 mb-4">
                {score}%
              </h1>

              <div className="mb-3">
                <h3 className="text-red-500 font-semibold">
                  Missing Skills
                </h3>
                {missingSkills.map((s, i) => (
                  <p key={i}>• {s}</p>
                ))}
              </div>

              <div>
                <h3 className="text-green-600 font-semibold">
                  Suggestions
                </h3>
                {suggestions.map((s, i) => (
                  <p key={i}>• {s}</p>
                ))}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}