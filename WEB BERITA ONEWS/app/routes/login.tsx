// @ts-nocheck
import { Form, useActionData, redirect } from "@remix-run/react";

// BACKEND: Memeriksa username & password saat tombol login ditekan
export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === "superuser" && password === "copilot14") {
    // Jika benar, buat session "authenticated" lalu oper ke dashboard admin
    return redirect("/admin", {
      headers: { "Set-Cookie": "admin_session=authenticated; Path=/; HttpOnly; Max-Age=86400" },
    });
  }
  return { error: "Username atau password salah!" };
}

// FRONTEND: Tampilan HTML Form Login
export default function Login() {
  const actionData = useActionData();

  return (
    <div style={{ fontFamily: "sans-serif", display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <Form method="post" style={{ border: "1px solid #ccc", padding: "30px", borderRadius: "8px", width: "300px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ textAlign: "center", margin: "0 0 20px 0" }}>Login Admin</h3>
        
        {actionData?.error && <p style={{ color: "red", fontSize: "14px" }}>{actionData.error}</p>}
        
        <label style={{ display: "block", marginBottom: "5px" }}>Username</label>
        <input type="text" name="username" required style={{ width: "93%", padding: "8px", marginBottom: "15px" }} />
        
        <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
        <input type="password" name="password" required style={{ width: "93%", padding: "8px", marginBottom: "20px" }} />
        
        <button type="submit" style={{ width: "100%", padding: "10px", background: "blue", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Masuk</button>
      </Form>
    </div>
  );
}
