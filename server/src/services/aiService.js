const OpenAI = require('openai');
const Exam = require('../models/Exam');
const Elective = require('../models/Elective');
const Policy = require('../models/Policy');
const CalendarEvent = require('../models/CalendarEvent');
const Reminder = require('../models/Reminder');
const StudentProfile = require('../models/StudentProfile');

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

const handleAssistantQuery = async (query, userId) => {
  const isDummyKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';

  try {
    // 1. Fetch Student Context (with fallback for wiped DB)
    let profile = await StudentProfile.findOne({ user: userId });
    if (!profile) {
      profile = { department: 'Computer Science', year: 4, semester: 7, section: 'A' };
    }
    
    // 2. Fetch Relevant Context
    let context = "";
    
    if (query.toLowerCase().includes('exam')) {
      const exams = await Exam.find({ department: profile.department, year: profile.year });
      context += "Upcoming Exams: " + (exams.length ? JSON.stringify(exams) : "Mid Semester Exams coming up soon.") + "\n";
    }
    
    if (query.toLowerCase().includes('elective')) {
      const electives = await Elective.find({ departmentEligibility: profile.department });
      context += "Available Electives: " + (electives.length ? JSON.stringify(electives) : "Machine Learning, Cloud Computing.") + "\n";
    }

    // 3. Fallback Mock AI Logic (when no real API key is present)
    if (isDummyKey) {
      const q = query.toLowerCase();
      
      // Career & Future Logic
      if (q.includes('future') || q.includes('career') || q.includes('job') || q.includes('placement')) {
        return `Based on your profile as a **${profile.department}** student in Year ${profile.year}, here are some suggestions for your future:
        
### 🚀 Career Pathways
* **Software Engineering**: Focus on mastering Data Structures, Algorithms, and System Design.
* **Artificial Intelligence & ML**: Very high demand. I recommend taking the *Advanced Machine Learning* elective next semester.
* **Cloud Computing**: Look into AWS or Azure certifications.

### 📚 Next Steps
1. **Internships**: Start applying for summer internships now. Update your resume to highlight your recent projects.
2. **Projects**: Build at least two full-stack or AI-driven applications to showcase your skills.
3. **Networking**: Attend the upcoming tech symposium organized by your department.

Let me know if you want to explore any of these specific paths!`;
      }

      // Education & Studies Logic
      if (q.includes('education') || q.includes('study') || q.includes('masters') || q.includes('higher')) {
        return `### 🎓 Higher Education Advice

If you are considering further education after your B.Tech in ${profile.department}, here is what you should focus on:

* **M.S. Abroad**: Start preparing for GRE/TOEFL. Maintain a CGPA above 8.5 and try to publish a research paper.
* **M.Tech (GATE)**: Begin GATE preparation early. Focus on core subjects like Operating Systems, DBMS, and Computer Networks.
* **MBA**: If you're leaning towards management, CAT/GMAT preparation should start in your 3rd year.

**Pro Tip:** Your upcoming exams carry significant weight for your final CGPA. Let me know if you'd like a study schedule!`;
      }

      // General Fallback
      return `Hello! As your Academic AI Assistant, I can help you with:
* **Academic Queries**: Information about your exams, timetable, and electives.
* **Future Suggestions**: Career advice, placement tips, and higher education guidance.

*(Note: I am currently running in offline mock mode. Connect a valid OpenAI API key to unlock my full generative capabilities!)*

How can I help you regarding your education today?`;
    }

    // 4. Real OpenAI Logic
    const systemPrompt = `
      You are the Student Support Agent, an expert academic and career advisor AI.
      User Profile: ${JSON.stringify(profile)}
      Relevant Context: ${context}
      
      Instructions:
      - Answer the user's query based on the context provided.
      - **CRITICAL**: You are deeply knowledgeable about education, career paths, future opportunities, and higher studies. Always provide proactive suggestions regarding their future when asked.
      - Personalize the response for the student based on their department (${profile.department}) and year (${profile.year}).
      - Keep it professional, highly encouraging, and structured.
      - Use markdown for formatting (bullet points, bold text).
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm sorry, I'm having trouble analyzing your request right now. Please try again in a moment.";
  }
};

module.exports = { handleAssistantQuery };
