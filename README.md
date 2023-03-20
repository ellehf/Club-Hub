# Club Hub
#### Team 4 - CS 130, Fall 2022
**Description**: Club Hub allows students to give candid reviews about their experiences with clubs.
Students can also post news and other relevant information about their club.
Club Hub will be a centralized place for club information and management.

## Environmental Variables
Environmental variables in this project to include in your .env.local file:

+ ``GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET``: unique Google identifier and token
+ ``NEXT_AUTH_URL``: URL of web app (i.e. http://localhost:3000/)
+ ``JWT_SECRET``: JSON web token
+ ``MONGODB_URI``: MongoDB connection string

## Getting Started

After cloning run:
```bash
npm install --legacy-peer-deps next
```

Go inside the club-hub directory:
```bash
cd club-hub
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**See README.md inside club-hub for project structure