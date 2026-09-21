// @ts-nocheck
import { Form, useLoaderData, redirect } from "@remix-run/react";

// BACKEND: Cek keamanan session cookie & ambil data berita
export async function loader({ request, context }) {
  const cookie = request.headers.get("Cookie") || "";
  if (!cookie.includes("admin_session=authenticated")) {
    return redirect("/login"); // Jika belum login, tendang balik ke halaman login
  }
  const db = context.cloudflare.env.DB;
  const { results } = await db.prepare("SELECT * FROM posts ORDER BY id DESC").all();
  return { berita: results || [] };
}

// BACKEND: Menangani tambah berita baru & hapus berita lama
export async function action({ request, context }) {
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "tambah") {
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image") || "";
    const date = new Date().toLocaleDateString('id-ID');

    await db.prepare("INSERT INTO posts (title, content, image, created_at) VALUES (?, ?, ?, ?)")
            .bind(title, content, image, date).run();
  }

  if (intent === "hapus") {
    const id = formData.get("id");
    await db.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  }

  return null;
}

// FRONTEND: Tampilan HTML Halaman Dashboard Admin
export default function Admin() {
  const { berita } = useLoaderData();

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>✍️ Dashboard Admin ONews</h2>
      <a href="/" style={{ color: "blue", textDecoration: "none" }}>← Lihat Web Utama</a>
      <hr style={{ margin: "20px 0" }} />

      {/* Form HTML Tambah Berita */}
      <Form method="post" style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h3>Tulis Berita Baru</h3>
        <input type="hidden" name="intent" value="tambah" />
        
        <label style={{ display: "block", marginBottom: "5px" }}>Judul Berita</label>
        <input type="text" name="title" required style={{ width: "97%", padding: "8px", marginBottom: "15px" }} />
        
        <label style={{ display: "block", marginBottom: "5px" }}>Link URL Gambar (Opsional)</label>
        <input type="text" name="image" placeholder="https://example.com" style={{ width: "97%", padding: "8px", marginBottom: "15px" }} />
        
        <label style={{ display: "block", marginBottom: "5px" }}>Isi Konten Berita</label>
        <textarea name="content" rows={6} required style={{ width: "97%", padding: "8px", marginBottom: "15px" }}></textarea>
        
        <button type="submit" style={{ padding: "10px 20px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Terbitkan Berita</button>
      </Form>

      {/* Daftar Manajemen Berita */}
      <h3>📰 Semua Daftar Berita</h3>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
        {berita.length === 0 ? <p>Belum ada berita.</p> : berita.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <div>
              <strong>{item.title}</strong>
              <span style={{ fontSize: "12px", color: "gray", marginLeft: "10px" }}>({item.created_at})</span>
            </div>
            <Form method="post">
              <input type="hidden" name="intent" value="hapus" />
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" style={{ background: "red", color: "white", border: "none", padding: "3px 8px", borderRadius: "4px", cursor: "pointer" }} onClick={(e) => { if(!confirm("Hapus berita ini?")) e.preventDefault(); }}>Hapus</button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
