import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `
You are a professional resume editor and ATS resume optimizer.

Your job is to tailor the user's resume to the job description without exaggerating, inventing experience, or adding fake numbers.

Return your response in this EXACT format:

IMPROVED RESUME BULLETS:
Profile Summary:
- Rewrite the user's profile summary in 2-3 strong resume-style bullets or short sentences.

Projects:
- Rewrite only the user's project-related experience here.

Work Experience:
- Rewrite only the user's work experience here.

Education:
- Only include education details if they are relevant.

KEYWORDS TO ADD:
- List important keywords from the job description that honestly match the user's resume.

MATCH SCORE:
Give only one number from 0 to 100.

WHY THIS SCORE:
- Explain the score in 2-3 bullets.

SUGGESTED IMPROVEMENTS:
- Give 2-4 realistic improvements.

Resume:
${resume}

Job Description:
${jobDescription}
`,
        },
      ],
    });

    return Response.json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}