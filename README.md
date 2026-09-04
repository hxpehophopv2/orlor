# OrLor - The INT134 System Deployment Study For Lazy Students

Welcome to **OrLor**, the interactive study guide for INT134. Because reading about Linux servers on static slides is like trying to learn how to swim by looking at a glass of water.

## What is this?

An overly-engineered, dangerously-interactive React app built to help you survive deployment exams.

It features:

- **Terminal Simulators:** So you can pretend to be a sysadmin without actually breaking a real server.
- **Architecture Visualizers:** Watch requests bounce between nginx, Node.js, and MySQL.
- **Least Privilege Sandboxes:** Try to `DROP DATABASE mysql` and see what happens.
- **Bilingual Support (EN/TH):** Because tech jargon is confusing enough in one language.

## How to run (Local Dev)

```bash
npm install
npm run dev
```

_(Pro tip: Use `npm ci` in production or the ghost of floating dependencies will haunt you.)_

## Classes Covered

- **Class 1 & 2:** Packages, Services, Processes, and Signals (a.k.a. "Why won't it die when I close the terminal?")
- **Class 3:** Static Web Deployment (a.k.a. "Where did nginx put my files?")
- **Class 4:** Backend & Database (a.k.a. "Why is root connecting to MySQL without a password?")

---

_Built with luv (& a lot of carrots and ai) for IT sophomore students_
