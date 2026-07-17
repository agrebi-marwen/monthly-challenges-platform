<div align="center">

# 🌀 The Time Portal

**Stabilizing timeline anomalies, one epoch at a time.**

[![Status](https://img.shields.io/badge/System_Status-Operational-10b981?style=for-the-badge&logo=statuspage&logoColor=white)](https://github.com)
[![Tech](https://img.shields.io/badge/Stack-Vanilla_JS_||_Supabase-f97316?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://github.com)

A gamified platform to solve coding challenges, track scores on a global leaderboard, and submit repository patches for timeline "anomalies."

[Explore Challenges](#-setup) • [Report Issue](https://github.com/your-username/time-portal/issues)

</div>

---

## 🚀 Tech Stack

| Frontend | Backend & Security |
| :--- | :--- |
| 🌐 **HTML5 / CSS3** (Space Grotesk typography) | ⚡ **Supabase** (PostgreSQL Database) |
| ⚡ **Vanilla JavaScript** (ES6+) | 🔐 **Row-Level Security (RLS)** & Auth |

---

## 📂 Project Structure

To keep the timeline organized, the repository is structured as follows:

```text
├── 📂 Account/         # Login and profile registration portal
├── 📂 Admin/           # Protected supervisor dashboard
├── 📂 Dashboard/       # Main temporal hub & active anomalies list
│   ├── dashboard.html
│   └── dashboard.js
|   ├── 📂 Submit/          # Transmutation Portal for git repo verification
|   │   ├── submit.html
|   │   └── submit.js
├── 📄 global.css      
├── 📄 server.js 
└── 📄 index.html       # Landing page portal
```

⚙️ Setup & Deployment

1. Configure Supabase Credentials
Locate the initialization blocks inside your JavaScript files (e.g., dashboard.js, submit.js) and replace the placeholders:

JavaScript
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

2. Run Locally
Spin up a local server to test the temporal streams:

Bash
python -m http.server 3030
Then visit: http://localhost:3030
