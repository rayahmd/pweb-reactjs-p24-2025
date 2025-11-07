import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login dengan ${email}`);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 w-full mb-3 rounded" />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
}
