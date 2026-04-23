import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Clock,
  Layout
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">Student Support Agent</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <a href="#features" className="text-gray-500 hover:text-primary transition-colors">Features</a>
          <a href="#benefits" className="text-gray-500 hover:text-primary transition-colors">Benefits</a>
          <Link to="/login" className="text-gray-500 hover:text-primary transition-colors">Login</Link>
          <Link to="/signup" className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-primary/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">AI-Powered Academic Assistant</span>
        </div>
        <h2 className="text-6xl md:text-7xl font-extrabold text-text leading-tight mb-6">
          Navigate your academic <br />
          <span className="text-primary">journey with ease.</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Access exam schedules, policies, electives, and personalized reminders 
          from one centralized platform. Your smart campus companion.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/signup" className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-primary/30 flex items-center justify-center group">
            Start Free Now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-white text-text border-2 border-border px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all">
            Student Login
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Everything a student needs.</h3>
            <p className="text-gray-500">Built for speed, accuracy, and ease of use.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Assistant",
                desc: "Natural language query handling for all your academic questions.",
                icon: MessageSquare,
                color: "bg-blue-500"
              },
              {
                title: "Academic Calendar",
                desc: "Integrated view of exams, deadlines, and college events.",
                icon: Calendar,
                color: "bg-green-500"
              },
              {
                title: "Policy Center",
                desc: "Instant access to attendance, exam, and registration rules.",
                icon: ShieldCheck,
                color: "bg-purple-500"
              }
            ].map((feature, i) => (
              <div key={i} className="card p-8 hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${feature.color.split('-')[1]}/20`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-8 grid sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl font-extrabold text-primary mb-2">10k+</p>
            <p className="text-gray-500 font-medium">Active Students</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary mb-2">50+</p>
            <p className="text-gray-500 font-medium">Departments</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary mb-2">100%</p>
            <p className="text-gray-500 font-medium">Academic Clarity</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary mb-2">24/7</p>
            <p className="text-gray-500 font-medium">AI Support</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold">Student Support Agent</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Student Support Agent. Built for Future Academics.</p>
          <div className="flex space-x-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
