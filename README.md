🥥 Chatbot Web Application
A production-ready chatbot application implemented with React + TypeScript + Tailwind CSS.
Features secure authentication, responsive UI, dark & light modes, and a real-time chat stream with a dummy or public LLM backend.
Bonus additions include voice input and prompt templates.

🔹 Tech Stack
Framework: React

Language: TypeScript

Auth: JWT (JSON Web Token)

Design: Tailwind CSS

Code Quality: ESLint + Prettier

Chat: Realtime messages with loading indicators, input history, and automatic scroll

Bonus:

Voice Input (using Web Speech API)

Prompt Templates (quick messages to reuse)

🔹 Features
✅ User Authentication:

Signup and Login with JWT authentication

Access control to chat page

✅ Chat UI:

Realtime messages from a dummy/public LLM backend

Loading indicators while bot responds

Auto-scrolling to the last message

Input history (press up arrow to reuse messages)

✅ Design:

Responsive UI: Works smoothly across desktop and mobile

Dark/Light mode: Easily toggle between themes

Styled with Tailwind CSS

✅ Code Quality:

Type-safe with TypeScript

ESLint and Prettier integrated

Functional components with hooks

✅ Bonus:

Voice Input: Speech-to-text messages

Prompt Templates: Pre-populated messages you can quickly send

🔹 Installation & Run
bash
Copy
Edit
# 1. Clone the repository
git clone <your-repo-url>
cd chatbot-app

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev

# 4. Open in your browser
http://localhost:5173
🔹 Project Structure (high-level)
pgsql
Copy
Edit
chatbot-app/
├─ src/
│ ├─ components/
│ ├─ hooks/
│ ├─ pages/
│ ├─ context/
│ ├─ utils/
│ └─ styles/
├─ public/
├─ package.json
├─ tsconfig.json
├─ tailwind.config.js
├─ .eslintrc.js
├─ .prettierrc
🔹 Additional Notes
Auth:
The application uses JWT to handle authentication.
The token is stored in localStorage and attached to subsequent API requests.

Chat:
The chat messages are routed through a dummy API or a public LLM endpoint.
Loading indicators show while the bot responds.

Design:
Styled entirely with Tailwind CSS.
Responsive and lightweight UI with a dark and light theme.

🔹 Improvement Ideas (Bonus)
🚀 Export Chat:
Option to download conversations as CSV or PDF.

🚀 Chat Analytics:
A small dashboard page to view total messages, average response time, and usage trends.

🔹 Contributing
Contributions, bug reports, and feature requests are warmly welcomed.
Please create a branch, make your modifications, and submit a Pull Request.

🔹 License
MIT License