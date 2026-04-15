# Contributing to NCET Buddy

First off, thank you for considering contributing to NCET Buddy! It's people like you that make it such a great platform for educators and students.

Our vision is to build an open-source platform driven by the community, particularly the students who use it to prepare for their exams.

## The Contribution Model: Organization-Restricted Open Source

NCET Buddy operates on a unique open-source model:
- The codebase is **open source** and visible to the public.
- We have **limited access to contribute for people outside the organization**.
- **Students can come and add features by themselves**, but they **need to be a member of the Ncetbuddy organization** to have their pull requests reviewed and merged.

### How to Become an Organization Member

We love welcoming passionate students to our team! To get an invite to the Ncetbuddy GitHub organization:
1. **Engage with the community:** Join our community channels and introduce yourself.
2. **Find an issue:** Look at our open issues and comment on one you'd like to work on. Let the maintainers know you want to tackle it.
3. **Request an invite:** Reach out to the core maintainers requesting to join the org so you can contribute.
4. **Accept the invite:** Once invited, you will have the necessary permissions to collaborate effectively within our ecosystem.
5. **Sign the CLA:** Ensure you read and agree to our [Contributor License Agreement](CLA.md) before submitting code.

### The Contributor License Agreement (CLA)

Because our long-term vision includes the potential future acquisition, licensing, or sale of this platform's business model and infrastructure to a larger Ed-Tech partner, all contributors are required to sign our **[Contributor License Agreement (CLA)](CLA.md)**. 

While the codebase is open source for students to learn and contribute to, the CLA ensures that **Ncetbuddy / Exam Buddy** retains full, unencumbered Intellectual Property (IP) rights over the entire platform. This makes it legally viable and "sellable" to corporate entities in the future.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Project Stack

Before contributing, please familiarize yourself with our technology stack:
* **Frontend:** Next.js 16 (React 19), App Router, Tailwind CSS, TypeScript
* **Backend:** PocketBase
* **Hosting:** Vercel (Frontend), AWS EC2 (Backend)

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title, a clear description, and a reproducible test case.

### Suggesting Enhancements

- Open a new issue with the `Feature Request` template.
- Provide a clear and detailed explanation of the feature you want and why it's important.

### Pull Requests (For Organization Members)

1. Once you are a member of the Ncetbuddy organization, you can branch off `main` or your designated environment. Non-members should fork the repo, but please note that we highly encourage you to join the organization first.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (if applicable).
5. Make sure your code lints.
6. Issue that pull request!

## Local Development Context

To set up the project locally:

1. Clone the repository.
2. Make sure you have Node installed.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the frontend server on `localhost:3000`.
5. For backend features, set up a local PocketBase instance with the schema mirroring production.

## Any questions?
If you have any questions, feel free to contact the maintainers or open an issue asking for clarification.
