import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory data store
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

let nextId = 3;

// Routes

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express CRUD API is running" });
});

// CREATE - Add a new user
app.post("/api/users", (req: Request, res: Response) => {
  const { name, email } = req.body as Partial<User>;

  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  const newUser: User = {
    id: nextId++,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// READ - Get all users
app.get("/api/users", (req: Request, res: Response) => {
  res.json(users);
});

// READ - Get a single user by ID
app.get("/api/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id || "0");
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

// UPDATE - Update a user by ID
app.put("/api/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id || "0");
  const { name, email } = req.body as Partial<User>;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (name) users[userIndex]!.name = name;
  if (email) users[userIndex]!.email = email;

  res.json(users[userIndex]);
});

// DELETE - Delete a user by ID
app.delete("/api/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id || "0");
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const deletedUser = users.splice(userIndex, 1);
  res.json({ message: "User deleted successfully", user: deletedUser[0] });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
