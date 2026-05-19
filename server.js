import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "backend works" });
});

app.post("/optimize", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `
You are a professional resume editor and ATS resume optimizer.

Your job is to tailor the user's resume to the job description without exaggerating, inventing experience, or adding fake numbers.

Important rules:
- Keep the user's actual experience truthful.
- Do NOT mix unrelated sections together.
- Do NOT turn education into work experience.
- Do NOT invent jobs, tools, certifications, metrics, or projects.
- Rewrite content so it is clearer, stronger, and more aligned with the job description.
- If a section does not apply, leave it out.

Return your response in this EXACT format:

IMPROVED RESUME BULLETS:
Profile Summary:
- Rewrite the user's profile summary in 2-3 strong resume-style bullets or short sentences.

Projects:
- Rewrite only the user's project-related experience here.
- Emphasize technologies, concepts, problem-solving, and deliverables.

Work Experience:
- Rewrite only the user's work experience here.
- Emphasize transferable skills like communication, organization, accuracy, teamwork, and fast-paced environments.

Education:
- Only include education details if they are relevant to the job description.
- Keep this brief.

KEYWORDS TO ADD:
- List important keywords from the job description that honestly match the user's resume.

MATCH SCORE:
Give only one number from 0 to 100.

WHY THIS SCORE:
- Explain the score in 2-3 bullets.

SUGGESTED IMPROVEMENTS:
- Give 2-4 realistic improvements the user could make to better match this job.


Resume:
${resume}

Job Description:
${jobDescription}

Output:
- Improved resume bullet points
- Keywords added
- Match score (0-100)
          `,
        },
      ],
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Something went wrong on the server.",
    });
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});