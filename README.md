# AUTO GENERATE WALLET MAVRYK
![image](https://github.com/user-attachments/assets/e682a16a-82f5-43f2-be4a-c049f9ee7270)

> Contact Me :
- **Telegram : https://t.me/Isrealll1**
<br><br>

![Node.js](https://img.shields.io/badge/Node.js-16.x_|_18.x_|_20.x-green.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

</div>

---

### ✨ Fitur Utama

* **Dua Mode Operasi**: Buat wallet baru atau gunakan mnemonic dari file `mnemonic.txt`.
* **Output Terstruktur**: Secara otomatis membuat folder `Baru/` atau `Lama/` dengan file `address.txt`, `privatekey.txt`, `mnemonic.txt`, dan `wallet.json`.
* **Standar Industri**: Menggunakan **BIP44 Derivation Path** (`m/44'/1729'/0'/0'`)
* **Profesional**: Tampilan CLI yang bersih dengan banner dan instruksi yang jelas.
* **Aman**: Tidak ada data yang dikirim ke luar. Semua proses pembuatan kunci terjadi secara lokal di mesin Anda.

---

### ⚙️ Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
* [Node.js](https://nodejs.org/) (versi 16.x atau lebih baru)
* npm (biasanya terinstal bersama Node.js)

---

### 🚀 Instalasi & Persiapan

1.  **Clone repositori ini:**
    ```sh
    git clone https://github.com/isrealllairdrop/Mvryrk-Generate-Wallet.git
    ```

2.  **Masuk ke direktori proyek:**
    ```sh
    cd Mvryrk-Generate-Wallet
    ```

3.  **Instal semua dependensi yang dibutuhkan:**
    ```sh
    npm install
    ```
    Perintah ini akan menginstal `bip39`, `libsodium-wrappers`, `blakejs`, `@mavrykdynamics/taquito-utils`, dan `ed25519-hd-key`.

---

### USAGE

1.  **Jalankan skrip:**
    ```sh
    node generate.js
    ```

2.  **Pilih Opsi:**
    * **Opsi 1: Buat wallet baru**
        * Pilih `1` dan tekan Enter.
        * Masukkan jumlah wallet yang ingin Anda buat.
        * Skrip akan menghasilkan wallet baru dan menyimpannya di dalam folder `Baru/`.

    * **Opsi 2: Gunakan mnemonic dari file**
        * Buat file bernama `mnemonic.txt` di direktori yang sama dengan `generate.js`.
        * Isi file tersebut dengan daftar mnemonic Anda (satu mnemonic per baris).
        * Pilih `2` dan tekan Enter.
        * Skrip akan memproses setiap mnemonic dan menyimpannya di dalam folder `Lama/`.

---

### 📁 Struktur Output

Setelah skrip selesai, Anda akan menemukan folder baru (`Baru/` atau `Lama/`) yang berisi:
* `address.txt`: Daftar alamat publik (mv1...).
* `privatekey.txt`: Daftar kunci privat yang sesuai.
* `mnemonic.txt`: Daftar mnemonic yang digunakan.
* `wallet.json`: Berisi semua data wallet dalam format JSON yang terstruktur.

---

### ⚠️ PERINGATAN KEAMANAN

* **PERLAKUKAN FILE OUTPUT DENGAN SANGAT HATI-HATI!**
* File `privatekey.txt`, `mnemonic.txt`, dan `wallet.json` berisi kunci akses penuh ke dana Anda. **Siapapun yang memiliki file ini bisa menguras dana Anda.**
* Jangan pernah membagikan file-file ini, mengunggahnya ke GitHub, atau menyimpannya di lokasi yang tidak aman (seperti Google Drive atau Dropbox publik).
* Gunakan skrip ini di lingkungan yang aman dan terpercaya. Anda bertanggung jawab penuh atas keamanan wallet Anda.

---

### 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

---
