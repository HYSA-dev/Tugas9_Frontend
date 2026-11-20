// Tahap 1: Verifikasi Token Autentikasi
const verifikasiToken = (tokenValid) => {
  return new Promise((resolve, reject) => {
    console.log("[1/3] Memverifikasi token sesi pengguna...");
    setTimeout(() => {
      if (tokenValid) {
        resolve({ token: "JWT-2026-XYZ", nim: "1125102206" });
      } else {
        reject(
          new Error("401 Unauthorized: Token tidak valid atau kedaluwarsa."),
        );
      }
    }, 1000);
  });
};
// Tahap 2: Ambil Profil Mahasiswa berdasarkan NIM dari Tahap 1
const ambilProfilMahasiswa = (dataAuth, serverProfilAktif = true) => {
  return new Promise((resolve, reject) => {
    console.log(`[2/3] Mengambil profil untuk NIM ${dataAuth.nim}...`);
    setTimeout(() => {
      if (serverProfilAktif) {
        resolve({
          nim: dataAuth.nim,
          nama: "Galing Surya",
          prodi: "S1 Teknik Informatika",
        });
      } else {
        reject(
          new Error(
            "500 Internal Server Error: Gagal memuat profil mahasiswa.",
          ),
        );
      }
    }, 1200);
  });
};
// Tahap 3: Ambil Nilai KRS berdasarkan Profil dari Tahap 2
const ambilNilaiKRS = (profil, krsTersedia = true) => {
  return new Promise((resolve, reject) => {
    console.log(`[3/3] Mengambil data nilai KRS milik ${profil.nama}...`);
    setTimeout(() => {
      if (krsTersedia) {
        resolve({
          mahasiswa: profil.nama,

          semester: 3,
          matkul: [
            {
              kode: "KK112104",
              nama: "Dasar Pemrograman Frontend",
              nilai: "A",
            },

            { kode: "KK112105", nama: "Struktur Data", nilai: "A-" },
          ],
        });
      } else {
        reject(
          new Error(
            "404 Not Found: Data KRS semester aktif belum diterbitkan.",
          ),
        );
      }
    }, 10000);
  });
};
// Eksekusi Chaining
const jalankanAlurAkademik = (tokenValid, serverProfilAktif, krsTersedia) => {
  console.log("=== MULAI PROSES PENGAMBILAN DATA AKADEMIK (SYNCHRONOUS) ===");

  verifikasiToken(tokenValid)
    .then((hasilAuth) => {
      console.log("✔ Token Valid:", hasilAuth.token);
      return ambilProfilMahasiswa(hasilAuth, serverProfilAktif);
    })
    .then((profil) => {
      console.log("✔ Profil Ditemukan:", profil.nama, "-", profil.prodi);
      return ambilNilaiKRS(profil, krsTersedia);
    })
    .then((dataKRS) => {
      console.log("✔ Data Nilai KRS Berhasil Dimuat:", dataKRS.matkul);
    })
    .catch((error) => {
      console.error("✖ Proses Dihentikan:", error.message);
    })
    .finally(() => {
      console.log("=== SIKLUS TRANSAKSI ASINKRON SELESAI ===");
    });
  console.log("=== KODE DI BAWAH PROMISE TETAP BERJALAN (NON-BLOCKING) ===");
};
// Uji Skenario 1 (Sukses) & Skenario 2 (Gagal di Tahap 2)
jalankanAlurAkademik(true, true, true);
setTimeout(() => {
  console.log("\n--- PENGUJIAN SKENARIO GAGAL (REJECT) ---");
  jalankanAlurAkademik(true, false, true);
}, 10000);
