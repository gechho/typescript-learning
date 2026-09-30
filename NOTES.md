# Notes

## Set up this project on a new machine

The dependencies are already listed in package.json, so this installs everything:

```bash
npm install
```

## Set up a new Express + TypeScript project from scratch

1. Create the folder and a package.json:

```bash
mkdir my-express-app && cd my-express-app
```

```bash
npm init -y
```

2. Install Express and body-parser (needed at runtime):

```bash
npm install express body-parser
```

3. Install TypeScript and the dev tools (needed only while developing):

```bash
npm install -D typescript @types/express @types/node ts-node nodemon
```

- `typescript`: the `tsc` compiler
- `@types/express`, `@types/node`: type definitions so TypeScript understands Express and Node
- `ts-node`, `nodemon`: run .ts directly and restart on changes (development only)

4. Create tsconfig.json (then replace its contents with the config below):

```bash
npx tsc --init
```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Note: `"moduleResolution": "node"` no longer works in new TypeScript versions. Use `NodeNext`.

5. Create the source folder and server file:

```bash
mkdir src && touch src/server.ts
```

Minimal src/server.ts:

```ts
import express, { Request, Response } from 'express';
import { json } from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

6. Optional: add scripts to package.json so you can type short commands:

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

- `npm run dev`: development, restarts automatically when you save
- `npm run build` then `npm start`: production-style, compiled JS

## Environment variables

The server reads the port from the `PORT` environment variable and falls back to 3000.
Run on a different port for one session:

```bash
PORT=4000 node dist/server.js
```

## Build and run

Compile TypeScript (reads tsconfig.json, outputs to `dist/`):

```bash
npx tsc
```

Compile and start the server:

```bash
npx tsc && node dist/server.js
```

Server URL: http://localhost:3000

## Stop the server

In the terminal where it's running: `Ctrl + C`

If it's running somewhere else, stop whatever is using port 3000:

```bash
lsof -ti :3000 | xargs kill
```

Check whether the port is free (no output means it's free):

```bash
lsof -i :3000
```

## Test the API

Get all users (also works in the browser):

```bash
curl http://localhost:3000/api/users
```

Get one user by id:

```bash
curl http://localhost:3000/api/users/1
```

Create a user (POST, the browser can't do this):

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"username":"alice","email":"alice@example.com"}'
```

Test validation (missing email, should return 400):

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"username":"bob"}'
```

Users are kept in memory, so new ones are lost when the server restarts.
