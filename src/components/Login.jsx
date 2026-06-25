/*
    This is a cosmetic login only, not a serious security tool.
*/
import { useState } from "react";
import users from "../data/users.json";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const foundUser = users.find(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      setError("Invalid username or password.");
      return;
    }

    const safeUser = {
      username: foundUser.username,
      role: foundUser.role,
      displayName: foundUser.displayName
    };

    localStorage.setItem("triokaUser", JSON.stringify(safeUser));
    onLogin(safeUser);
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Trioka Atlas</h1>
        <p>Enter your campaign access credentials.</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit">Enter Atlas</button>
      </form>
    </div>
  );
}