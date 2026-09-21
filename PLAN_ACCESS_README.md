# Speakly plan/access update

## Normal build
- Basic: daily class, revision, community, AI Chat (2 hours/day), daily/weekly challenges.
- Premium: everything in Basic + teacher connections/lessons/assignments, contest, AI Video Call (5 hours/day).
- Advance: everything in Premium + Advance limits/features, AI Video Call (10 hours/day).
- Student-to-student Video Room is only through Community friend invitations.
- AI time is measured by an active AI session timer, not by simply opening Speakly.
- Completing the full daily class calls the daily-complete endpoint. The streak increases once per completed day and Learn shows a tomorrow message after completion.

## AI Chat
The student can create an AI friend, provide a topic and their own story/scenario, ask follow-up questions, choose Auto/English/Hindi/Hinglish, and keep the AI focused on that context. Words found in the user's story/messages that are not already in the Word collection are auto-synced.

## Developer build
The separate developer ZIP has:
- `VITE_DEVELOPER_MODE=true`
- `DEV_PLAN_BYPASS=true`

This makes plan-restricted UI/backend features accessible for testing while keeping the user's stored plan unchanged. It also exposes the Advance AI time allowance for testing.

Do not deploy the developer build to production.
