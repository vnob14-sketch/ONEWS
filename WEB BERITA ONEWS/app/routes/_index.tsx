// @ts-nocheck
import { useLoaderData } from "@remix-run/react";

// BACKEND: Mengambil data berita dari database Cloudflare D1
export async function loader({ context }) {
  const db = context.cloudflare.env.DB;
  const { results } = await db.prepare("SELECT * FROM posts ORDER BY id DESC").all();
  return { berita: results || [] };
}

// FRONTEND: Tampilan HTML untuk pembaca
export default function Index() {
  const { berita } = useLoaderData();

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
        <h1 style={{ color: "red", margin: 0 }}>ONEWS</h1>
        <p>Portal Berita Simpel Fullstack</p>
        <a href="/login" style={{ float: "right", marginTop: "-40px", background: "#333", color: "#fff", padding: "5px 10px", textDecoration: "none", borderRadius: "4px" }}>Login Admin</a>
      </header>

      <main>
        <h2>📰 Berita Terbaru</h2>
        {berita.length === 0 ? (
          <p><i>Belum ada berita. Silakan login ke Admin untuk menulis berita pertama Anda!</i></p>
        ) : (
          berita.map((item) => (
            <article key={item.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px", borderRadius: "8px" }}>
              {item.image && <img src={item.image} alt={item.title} style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "4px" }} />}
              <h3 style={{ margin: "10px 0 5px 0" }}>{item.title}</h3>
              <p style={{ color: "gray", fontSize: "12px" }}>Diterbitkan pada: {item.created_at}</p>
              <p style={{ whiteSpace: "pre-line" }}>{item.content}</p>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
