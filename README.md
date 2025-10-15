# 🚀 DualAgents-AB

🔗 **Live Demo:** [https://dual-agents-ab.vercel.app/](https://dual-agents-ab.vercel.app/)  
💻 **GitHub Repository:** [VyshnaviVunnamatla/DualAgents-AB](https://github.com/VyshnaviVunnamatla/DualAgents-AB)

---

## 🧠 Overview

**DualAgents-AB** is a modern full-stack web application that demonstrates a **Dual-Agent A/B Testing and Decision Framework**, designed to compare and optimize two independent decision agents in real time.  
It enables adaptive testing, performance tracking, and intelligent variant selection — making it highly useful for **research, product experimentation**, and **machine learning model evaluation**.

This project showcases scalable architecture, full-stack deployment, and the ability to run controlled experiments efficiently — ideal for both learning and professional portfolio demonstration.

---

## ✨ Features

- 🧩 **Dual-Agent Framework:** Compare and evaluate two independent agents (A & B) in real-time.  
- ⚙️ **Dynamic A/B Testing:** Automatically serve variant logic through backend APIs.  
- 📊 **Performance Tracking:** Log and analyze success metrics and response patterns.  
- 💬 **Responsive Frontend:** Clean, interactive UI built for smooth user interaction.  
- 🔐 **Secure Architecture:** Uses environment-based configuration and CORS protection.  
- ☁️ **Fully Deployed:** Frontend hosted on **Vercel**, backend integrated seamlessly.

---

## 🏗️ Architecture

The app follows a **modular two-tier architecture**:

### Frontend (React / Vite / Next.js) → REST API (Node.js / Express) → Data Layer (MongoDB / JSON)
cd DualAgents-AB


Each agent represents an independent decision logic engine that returns variant responses.  
The system allows easy switching between **Agent A** and **Agent B** to measure performance differences and optimize decision outcomes.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Vite (or Next.js) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / JSON-based store |
| **Version Control** | Git & GitHub |
| **Deployment** | Vercel |
| **Styling** | CSS3, TailwindCSS / Bootstrap |

---

## ⚙️ Getting Started

### 1️⃣ Prerequisites

Ensure the following are installed:

- Node.js (>= 16.x)
- npm or yarn
- MongoDB (if using a database backend)

---

### 2️⃣ Installation

Clone this repository:

```bash
git clone https://github.com/VyshnaviVunnamatla/DualAgents-AB.git
```
#### Install dependencies for both frontend and backend:

cd frontend
npm install

cd ../backend
npm install

---

### 3️⃣ Environment Variables

Create .env files in both frontend and backend directories.

#### backend/.env

PORT=5000
DATABASE_URL=your_database_connection_string
CORS_ORIGIN=https://dual-agents-ab.vercel.app

#### frontend/.env

VITE_API_BASE_URL=http://localhost:5000

---

### 4️⃣ Run Locally

#### Start Backend:

cd backend
npm run dev


#### Start Frontend:

cd frontend
npm run dev

Your application should now be running at:
👉 http://localhost:5173 — Frontend
👉 http://localhost:5000 — Backend API

---

## 🧩 Folder Structure

DualAgents-AB/
│
├── frontend/           # React/Vite Frontend
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── pages/      # Page-level logic
│   │   ├── services/   # API handling
│   │   └── App.jsx
│   └── vite.config.js
│
├── backend/            # Node.js Express API
│   ├── routes/         # API endpoints
│   ├── controllers/    # Business logic
│   ├── models/         # Data schema / structure
│   ├── utils/          # Helper functions
│   └── server.js
│
└── README.md

---

## 🧪 How It Works

1. The frontend sends a request asking which Agent (A or B) should respond.

2. The backend randomly or strategically selects an agent and returns its response.

3. The frontend displays the output dynamically based on the selected agent.

4. User interactions and results can be logged for future analysis.

5. The comparison between Agent A & B helps measure performance and accuracy.

This mechanism makes it ideal for:

- Model comparison

- Reinforcement learning behavior testing

- UI/UX A/B analysis

- Algorithmic decision evaluation

---

## 🌍 Deployment

The project is fully deployed and live on Vercel:
👉 https://dual-agents-ab.vercel.app/

To deploy your own version:

1. Push this repository to GitHub.

2. Link it with your Vercel account.

3. Set required environment variables in the Vercel Dashboard.

4. Deploy — your app will go live automatically.

---

## 💡 Future Enhancements

- 📈 Add analytics dashboard for real-time experiment insights

- 🧮 Integrate reinforcement learning–based agent logic

- 🔐 Add JWT authentication for admin and test control

- 🧰 Implement persistent experiment data logging

- 📊 Visualize results using charts (Recharts / D3.js)

---

## 🏅 Achievements / Highlights

- Built a full-stack Dual-Agent Decision Framework

- Designed and deployed a real-time A/B testing system

- Implemented clean frontend-backend synchronization

- Demonstrated scalable, extensible full-stack architecture

- Ideal showcase project for SDE / ML-based engineering roles

---

## 🤝 Contributing

Contributions are welcome!
To contribute:

1. Fork this repository

2. Create a feature branch:

``` bash
git checkout -b feature-name
```

3. Commit your changes and push the branch

4. Open a Pull Request 🚀

---

## 📜 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 👩‍💻 Author

#### 👤 Vyshnavi Vunnamatla
#### 📧 vyshnavivunnamatla@gmail.com

#### 💼 LinkedIn

---

⭐ If you found this project useful or interesting, please consider giving it a star on GitHub — it really helps! ⭐


---

✅ Just copy the entire block above and paste it directly into your repository’s `README.md` file.  
Would you like me to make a **shorter “resume-style summary paragraph”** (2–3 lines) that you can use in your resume or LinkedIn for this project too?

