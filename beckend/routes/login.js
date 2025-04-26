import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";  // you should move this to env in production!

export async function POST(req) {
  const { email, password } = await req.json();

  // Dummy user (you can connect with DB here)
  const user = {
    id: 1,
    email: "admin@example.com",
    password: "password123"  // In real life, never store password plain like this
  };

  if (email === user.email && password === user.password) {
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return Response.json({ token });
  } else {
    return Response.json({ message: "Invalid email or password" }, { status: 401 });
  }
}
