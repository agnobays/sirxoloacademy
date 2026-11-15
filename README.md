# Sir Xolo Academy

Official platform for **Sir Xolo Academy** ([sirxoloacademy.co.za](https://sirxoloacademy.co.za)).

Interactive, mastery-based Foundation Phase learning in **English Literacy**, **Mathematics**, and **isiZulu Ulwimi**.

---

## 🚀 SDLC & Branching Strategy

Our software development life cycle follows a strict promotion pipeline:

```
[dev]  -->  Feature development & experiments
  ↓
[qa]   -->  Staging validation, parent/learner testing
  ↓
[main] -->  Production release deployed to sirxoloacademy.co.za
```

- **`dev`**: Active feature development, step additions, UI enhancements.
- **`qa`**: Integration testing, quiz validation, payment test runs.
- **`main`**: Production ready. Every merge triggers deployment to live production hosting.

---

## 🔗 Dual Git Remotes Configuration

The project is synchronized with both GitHub and the live production hosting server:

1. **GitHub Remote (`origin`)**:
   `https://github.com/agnobays/sirxoloacademy.git`

2. **Hosting Production Remote (`hosting`)**:
   `sirxoloa@da43.host-ww.net:domains/sirxoloacademy.co.za/sirxolo.git`

### Helpful Commands

```bash
# Push to GitHub
git push origin <branch>

# Push main to production hosting server
git push hosting main

# Or push to both
git push origin main && git push hosting main
```

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling**: Tailwind CSS
- **Interactivity**: Web Audio synthesizer, instant audio pronunciation, canvas confetti
- **Mobile / Tablet**: Progressive Web App (PWA) manifest ready for home screen installation and Android tablet deployment
- **E-Commerce & Subscriptions**:
  - Monthly Subscriptions: R150 (1 subject), R250 (2 subjects), R350 (all 3)
  - Standalone Store: Physical workbooks & storybooks
