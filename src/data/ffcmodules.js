// Moved from ffcdentalclinic.com/growth-partner on 2026-09-17 (Jarich: "we will be removing that ffcdentalclinic.com/growthpartner
// and we will replace it for this"). Word for word, the module lists the FFC page carried.
export const SAE = {
  title: 'Software and Agentic Engineering',
  lead: "Ten modules on building real software in the age of AI, from the first written thought to a system running live. Taught the way the studio builds: think first, plan by hand, let agents do the heavy lifting, and verify everything before calling it done.",
  modules: [
    { title: "Module 1 · Thinking Before Building", points: ["The problem statement, written before any tool is opened", "Success criteria you can verify, not vibes", "Choosing what not to build, and saying why", "Small bets: prototype, measure, then decide"] },
    { title: "Module 2 · Software Development Foundations", points: ["How the web works: pages, servers, and databases", "Reading and writing code with an AI at your side", "Version control: history, branches, and undo for whole projects", "Shipping: from a laptop to a live URL"] },
    { title: "Module 3 · Agentic Coding", points: ["Working with coding agents: instructions, context, and review", "The 10 80 10 method: plan by hand, delegate the middle, finish by hand", "Verification discipline: nothing is shipped until you have seen it live", "When to trust the agent, and when to take the wheel"] },
    { title: "Module 4 · Agents & Agentic Engineering", points: ["What an agent really is: model, tools, memory, and a loop", "Designing tools an agent can use safely", "Orchestration: many small agents beat one giant prompt", "Guardrails: permissions, dry runs, and human gates"] },
    { title: "Module 5 · Knowledge Bases & the Second Brain", points: ["Capture: everything lands in one inbox first", "Structure: folders that mirror how you actually think", "Linked notes, wikilinks, and the graph between ideas", "Publishing your knowledge as a website your team can search"] },
    { title: "Module 6 · Security Essentials", points: ["Passwords, passkeys, and two factor authentication people actually use", "Phishing and social engineering: training the human firewall", "Least privilege: who can touch what, and why", "Backups that survive a very bad day"] },
    { title: "Module 7 · Auditing & Review", points: ["Reading a system you did not write", "Logs as evidence: what happened, when, and by whom", "Reviewing AI written code: what to check first", "The negative control: proving a test can actually fail"] },
    { title: "Module 8 · Data & Integrations", points: ["APIs in plain terms: how software asks and answers", "Webhooks, automations, and pipelines", "One source of truth: ending the copy paste economy", "Owning your data: exports, formats, and escape hatches"] },
    { title: "Module 9 · Shipping & Operating Real Systems", points: ["Deploys, domains, and knowing your system is up", "Incident thinking: what to do when it breaks at 9pm", "Change logs and the discipline of small releases", "Handover: systems that outlive their builder"] },
    { title: "Module 10 · The Studio Capstone", points: ["Build a working tool for your own clinic or business", "Present it: the problem, the build, and the proof", "A review of your build by the studio, line by line", "Leave with something you will still be using next year"] }
  ],
};

export const DA = {
  title: 'Dental Assistant Training',
  lead: "Nine modules take you from your first day to real chairside competence, taught inside a working clinic and beside the largest dental showroom in the country, on the same chairs, scanners, and x-rays you will use on the job.",
  modules: [
    { title: "Module 1 · Introduction to Dentistry", points: ["Dental terminology, so charts and instructions read clearly", "The dental specialties and what each one treats", "The role and responsibilities of a dental assistant", "Ethics and professionalism at the chair"] },
    { title: "Module 2 · Infection Control", points: ["Sterilization techniques, done the same way every time", "Instrument processing, from used tray to sealed pouch", "Personal protective equipment, worn right", "Clinic sanitation protocols"] },
    { title: "Module 3 · Dental Instruments", points: ["Instrument identification", "Proper handling", "Instrument organization", "Tray setup for each kind of procedure"] },
    { title: "Module 4 · Chairside Assisting", points: ["Four-handed dentistry", "Patient preparation", "Instrument transfer that keeps the dentist's eyes on the tooth", "Suction techniques"] },
    { title: "Module 5 · Dental Equipment Operation", points: ["Dental chair operation and care", "Curing light", "Ultrasonic scaler", "Compressor and suction system", "Digital x-ray overview"] },
    { title: "Module 6 · Dental Procedures", points: ["Restorative procedures", "Extractions", "Endodontics", "Prosthodontics", "Orthodontics", "Preventive dentistry"] },
    { title: "Module 7 · Patient Management", points: ["Communication skills", "Appointment scheduling", "Medical history documentation", "Patient education"] },
    { title: "Module 8 · Emergency Protocols", points: ["Medical emergencies in the dental setting", "Infection exposure protocol", "Basic life support awareness"] },
    { title: "Module 9 · Hands-on Clinical Training", points: ["Chairside simulation", "Actual clinical setup", "Equipment handling", "Practical competency assessment"] }
  ],
};

export const PRIVACY = {
  lead: "Plain words, no fine print. This is what happens to what you send us.",
  items: [
    { title: "What we collect", text: "Your name, your group, your role in it, mobile number, email, what you teach, how often and for how many, one link to your work, and the words you write to us. Nothing is collected in the background." },
    { title: "Why we collect it", text: "To consider a Growth Partnership with you and to contact you about it. Nothing else. No marketing, no lists." },
    { title: "Who sees it", text: "Only the owners of DentaSource Direct. It is never sold, and never shared outside the company." },
    { title: "How long we keep it", text: "Up to 12 months from the day you write to us, then it is removed automatically. If we partner, your details move to your partner file instead." },
    { title: "Where it lives", text: "On secure cloud storage, and in the owners' inbox. Nothing is published." },
    { title: "Your rights", text: "Under the Data Privacy Act of 2012 (Republic Act 10173) you may ask what we hold about you, ask us to correct it, or ask us to delete it before the 12 months are up. Write to info@dentasourcedirect.com from the email you applied with and we will act on it." }
  ],
};
