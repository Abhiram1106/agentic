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
  if (!openai) {
    return "I'm currently in basic mode because my AI brain is not fully configured. Please contact the administrator to set the OpenAI API key.";
  }
  try {
    // 1. Fetch Student Context
    const profile = await StudentProfile.findOne({ user: userId });
    
    // 2. Simple Keyword-based Retrieval (Hackathon style)
    // In a real app, we might use embeddings or a more complex classifier.
    let context = "";
    
    if (query.toLowerCase().includes('exam')) {
      const exams = await Exam.find({ department: profile.department, year: profile.year });
      context += "Upcoming Exams: " + JSON.stringify(exams) + "\n";
    }
    
    if (query.toLowerCase().includes('elective')) {
      const electives = await Elective.find({ departmentEligibility: profile.department });
      context += "Available Electives: " + JSON.stringify(electives) + "\n";
    }
    
    if (query.toLowerCase().includes('policy') || query.toLowerCase().includes('rule')) {
      const policies = await Policy.find({});
      context += "Academic Policies: " + JSON.stringify(policies) + "\n";
    }
    
    if (query.toLowerCase().includes('event') || query.toLowerCase().includes('date') || query.toLowerCase().includes('calendar')) {
      const events = await CalendarEvent.find({});
      context += "Calendar Events: " + JSON.stringify(events) + "\n";
    }

    // 3. Construct Prompt
    const systemPrompt = `
      You are the Student Support Agent, a helpful and friendly academic assistant.
      User Profile: ${JSON.stringify(profile)}
      Relevant Context: ${context}
      
      Instructions:
      - Answer the user's query based on the context provided.
      - If the information is not in the context, be honest but helpful.
      - Personalize the response for the student (refer to their department, year, etc. if relevant).
      - Keep it concise, professional, and supportive.
      - Use markdown for formatting (bullet points, bold text).
      - If the user asks to "set a reminder", tell them they can click the "Set Reminder" button in the UI or you can help them draft one.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use 3.5 for speed/cost in hackathon
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
};

module.exports = { handleAssistantQuery };
