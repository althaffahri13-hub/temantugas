/* ==================================
   DATA MAHASISWA
================================== */

// Mengambil data mahasiswa dari localStorage
let mahasiswa = JSON.parse(
    localStorage.getItem("dataMahasiswa")
) || [];

// Mengambil elemen HTML
const form = document.getElementById("formMahasiswa");
const daftar = document.getElementById("daftarMahasiswa");
const jumlah = document.getElementById("jumlahMahasiswa");

// Menyimpan data mahasiswa
function simpanData() {
    localStorage.setItem(
        "dataMahasiswa",
        JSON.stringify(mahasiswa)
    );
}

// Menampilkan data mahasiswa
function tampilkanData() {

    if (!daftar) return;

    daftar.innerHTML = "";

    const kolomPencarian =
        document.getElementById("cariMahasiswa");

    const kataKunci = kolomPencarian
        ? kolomPencarian.value.toLowerCase().trim()
        : "";

    const dataTampil = mahasiswa.filter(mhs => {

        return (
            mhs.nim.toLowerCase().includes(kataKunci) ||
            mhs.nama.toLowerCase().includes(kataKunci) ||
            mhs.kelas.toLowerCase().includes(kataKunci)
        );

    });

    dataTampil.forEach(mhs => {

        const index = mahasiswa.indexOf(mhs);

        daftar.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${mhs.nim}</td>
                <td>${mhs.nama}</td>
                <td>${mhs.kelas}</td>
                <td>
                    <button onclick="editMahasiswa(${index})">
                        Edit
                    </button>

                    <button onclick="hapusMahasiswa(${index})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;

    });

    if (jumlah) {
        jumlah.textContent =
            `Menampilkan ${dataTampil.length} dari ${mahasiswa.length} mahasiswa`;
    }
}

// Menambahkan mahasiswa
if (form) {

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const nim =
            document.getElementById("nim").value.trim();

        const nama =
            document.getElementById("nama").value.trim();

        const kelas =
            document.getElementById("kelas").value.trim();

        if (mahasiswa.some(mhs => mhs.nim === nim)) {
            alert("NIM tersebut sudah terdaftar!");
            return;
        }

        mahasiswa.push({
            nim,
            nama,
            kelas
        });

        simpanData();
        tampilkanData();

        form.reset();

        alert("Mahasiswa berhasil ditambahkan!");

    });

}

// Menghapus mahasiswa
function hapusMahasiswa(index) {

    if (confirm("Yakin ingin menghapus mahasiswa ini?")) {

        mahasiswa.splice(index, 1);

        simpanData();
        tampilkanData();

    }

}

// Mengedit mahasiswa
function editMahasiswa(index) {

    const mhs = mahasiswa[index];

    const namaBaru = prompt(
        "Masukkan nama baru:",
        mhs.nama
    );

    if (namaBaru === null || !namaBaru.trim()) return;

    const kelasBaru = prompt(
        "Masukkan kelas baru:",
        mhs.kelas
    );

    if (kelasBaru === null || !kelasBaru.trim()) return;

    mhs.nama = namaBaru.trim();
    mhs.kelas = kelasBaru.trim();

    simpanData();
    tampilkanData();

}

// Menampilkan data saat halaman dibuka
tampilkanData();


// ==================================
// FITUR RANDOMIZE KELOMPOK
// ==================================

const formRandomize =
    document.getElementById("formRandomize");

const totalPeserta =
    document.getElementById("totalPeserta");

// Menampilkan jumlah mahasiswa
if (totalPeserta) {

    totalPeserta.textContent =
        mahasiswa.length + " Mahasiswa";

}

// Proses randomisasi
if (formRandomize) {

    formRandomize.addEventListener("submit", function(event) {

        event.preventDefault();

        const jumlahKelompok = Number(
            document.getElementById("jumlahKelompok").value
        );

        if (mahasiswa.length === 0) {
            alert("Belum ada data mahasiswa! Silakan input mahasiswa dahulu.");
            return;
        }

        if (
            jumlahKelompok < 1 ||
            jumlahKelompok > mahasiswa.length
        ) {
            alert("Jumlah kelompok tidak valid!");
            return;
        }

        // Membuat salinan data mahasiswa
        let pesertaAcak = [...mahasiswa];

        // Mengacak mahasiswa
        for (let i = pesertaAcak.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [pesertaAcak[i], pesertaAcak[j]] =
            [pesertaAcak[j], pesertaAcak[i]];

        }

        // Membuat kelompok kosong
        let kelompok = [];

        for (let i = 0; i < jumlahKelompok; i++) {
            kelompok.push([]);
        }

        // Membagikan mahasiswa
        pesertaAcak.forEach((mhs, index) => {

            kelompok[index % jumlahKelompok].push(mhs);

        });

        // Menyimpan hasil randomisasi
        const hasil = {

            tanggal: new Date().toLocaleString("id-ID"),

            kelompok: kelompok

        };

        hasil.id = Date.now();

        localStorage.setItem(
            "hasilKelompokTerakhir",
            JSON.stringify(hasil)
        );

        // Menambahkan hasil ke riwayat
        let riwayat = JSON.parse(
            localStorage.getItem("riwayatKelompok")
        ) || [];

        riwayat.unshift(hasil);

        localStorage.setItem(
            "riwayatKelompok",
            JSON.stringify(riwayat)
        );

        // Pindah ke halaman hasil
        window.location.href = "hasil.html";

    });

}


// ==================================
// MENAMPILKAN HASIL KELOMPOK
// ==================================

const daftarKelompok =
    document.getElementById("daftarKelompok");

const informasiHasil =
    document.getElementById("informasiHasil");

if (daftarKelompok) {

    const hasilTersimpan = JSON.parse(
        localStorage.getItem("hasilKelompokTerakhir")
    );

    daftarKelompok.innerHTML = "";

    if (!hasilTersimpan) {

        informasiHasil.textContent =
            "Belum ada hasil randomisasi. Silakan lakukan randomize terlebih dahulu.";

    } else {

        const kelompok = hasilTersimpan.kelompok;

        informasiHasil.textContent =
            "Total " +
            kelompok.reduce((total, anggota) => total + anggota.length, 0) +
            " mahasiswa | " +
            kelompok.length +
            " kelompok | Dibuat: " +
            hasilTersimpan.tanggal;

        informasiHasil.className = "result-info";

        kelompok.forEach((anggota, index) => {

            const card = document.createElement("div");
            card.className = "group-card";

            const judul = document.createElement("h3");

            judul.textContent =
                "Kelompok " +
                (index + 1) +
                " (" +
                anggota.length +
                " Anggota)";

            card.appendChild(judul);

            anggota.forEach(mhs => {

                const item = document.createElement("div");

                item.className = "group-member";

                item.textContent =
                    mhs.nama + " - " + mhs.nim;

                card.appendChild(item);

            });

            daftarKelompok.appendChild(card);

        });

    }

}


// ==================================
// FITUR RIWAYAT RANDOMIZE
// ==================================

const daftarRiwayat =
    document.getElementById("daftarRiwayat");

if (daftarRiwayat) {

    let riwayat = JSON.parse(
        localStorage.getItem("riwayatKelompok")
    ) || [];

    if (riwayat.length === 0) {

        daftarRiwayat.innerHTML = `
            <div class="empty-history">
                Belum ada riwayat randomisasi.
            </div>
        `;

    } else {

        riwayat.forEach((hasil, index) => {

            const card = document.createElement("div");

            card.className = "history-card";

            const judul = document.createElement("h3");

            judul.textContent =
                "Randomisasi #" + (index + 1);

            const tanggal = document.createElement("p");

            tanggal.textContent =
                "Tanggal: " +
                hasil.tanggal +
                " | Jumlah kelompok: " +
                hasil.kelompok.length;

            const tombol = document.createElement("button");

            tombol.textContent = "Lihat Hasil";

            tombol.addEventListener("click", function() {

                localStorage.setItem(
                    "hasilKelompokTerakhir",
                    JSON.stringify(hasil)
                );

                window.location.href = "hasil.html";

            });

            card.appendChild(judul);
            card.appendChild(tanggal);
            card.appendChild(tombol);

            daftarRiwayat.appendChild(card);

        });

    }

    // Menghapus seluruh riwayat
    const tombolHapus = document.getElementById(
        "hapusSemuaRiwayat"
    );

    if (tombolHapus) {

        tombolHapus.addEventListener("click", function() {

            if (riwayat.length === 0) {

                alert("Belum ada riwayat untuk dihapus.");
                return;

            }

            if (confirm("Yakin ingin menghapus semua riwayat?")) {

                localStorage.removeItem("riwayatKelompok");

                location.reload();

            }

        });

    }

}


// ==================================
// FITUR PENCARIAN MAHASISWA
// ==================================

const cariMahasiswa =
    document.getElementById("cariMahasiswa");

if (cariMahasiswa) {

    cariMahasiswa.addEventListener(
        "input",
        tampilkanData
    );

}


// ==================================
// FITUR EXPORT CSV
// ==================================

const tombolExport =
    document.getElementById("exportCSV");

if (tombolExport) {

    tombolExport.addEventListener("click", function() {

        if (mahasiswa.length === 0) {

            alert("Belum ada data mahasiswa untuk diekspor!");
            return;

        }

        const header = [
            "NIM",
            "Nama Mahasiswa",
            "Kelas"
        ];

        const barisData = mahasiswa.map(mhs => [

            mhs.nim,
            mhs.nama,
            mhs.kelas

        ]);

        const semuaBaris = [
            header,
            ...barisData
        ];

        const isiCSV = semuaBaris.map(baris =>

            baris.map(nilai =>

                `"${String(nilai).replace(/"/g, '""')}"`

            ).join(",")

        ).join("\n");

        const file = new Blob(

            ["\uFEFF" + isiCSV],

            { type: "text/csv;charset=utf-8;" }

        );

        const url = URL.createObjectURL(file);

        const link = document.createElement("a");

        link.href = url;

        link.download =
            "Data_Mahasiswa_TemanTugas.csv";

        link.click();

        URL.revokeObjectURL(url);

    });

}


// ==================================
// FITUR IMPORT CSV
// ==================================

const tombolImport =
    document.getElementById("importCSV");

const fileCSV =
    document.getElementById("fileCSV");

if (tombolImport && fileCSV) {

    tombolImport.addEventListener("click", function() {

        fileCSV.click();

    });

    fileCSV.addEventListener("change", function() {

        const file = fileCSV.files[0];

        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".csv")) {

            alert("Silakan pilih file CSV!");

            fileCSV.value = "";

            return;

        }

        const reader = new FileReader();

        reader.onload = function(event) {

            const isiFile = event.target.result;

            const teks = isiFile.replace(/^\uFEFF/, "");

            const barisPertama = teks.split(/\r?\n/)[0];

            const jumlahKoma =
                (barisPertama.match(/,/g) || []).length;

            const jumlahTitikKoma =
                (barisPertama.match(/;/g) || []).length;

            const pemisah =
                jumlahTitikKoma > jumlahKoma ? ";" : ",";

            // Membaca isi CSV
            const baris = [];

            let kolom = "";
            let dataBaris = [];
            let dalamKutip = false;

            for (let i = 0; i < teks.length; i++) {

                const karakter = teks[i];
                const berikutnya = teks[i + 1];

                if (
                    karakter === '"' &&
                    dalamKutip &&
                    berikutnya === '"'
                ) {

                    kolom += '"';
                    i++;

                }

                else if (karakter === '"') {

                    dalamKutip = !dalamKutip;

                }

                else if (
                    karakter === pemisah &&
                    !dalamKutip
                ) {

                    dataBaris.push(kolom.trim());
                    kolom = "";

                }

                else if (
                    (karakter === "\n" || karakter === "\r") &&
                    !dalamKutip
                ) {

                    if (
                        karakter === "\r" &&
                        berikutnya === "\n"
                    ) {
                        i++;
                    }

                    dataBaris.push(kolom.trim());

                    if (dataBaris.some(nilai => nilai !== "")) {
                        baris.push(dataBaris);
                    }

                    dataBaris = [];
                    kolom = "";

                }

                else {

                    kolom += karakter;

                }

            }

            // Membaca baris terakhir
            dataBaris.push(kolom.trim());

            if (dataBaris.some(nilai => nilai !== "")) {
                baris.push(dataBaris);
            }

            if (baris.length < 2) {

                alert("File CSV tidak memiliki data mahasiswa!");

                fileCSV.value = "";

                return;

            }

            // Memeriksa judul kolom
            const header = baris[0].map(nilai =>
                nilai.toLowerCase().trim()
            );

            const posisiNim = header.indexOf("nim");
            const posisiNama = header.indexOf("nama");
            const posisiKelas = header.indexOf("kelas");

            if (
                posisiNim === -1 ||
                posisiNama === -1 ||
                posisiKelas === -1
            ) {

                alert(
                    "Format CSV harus memiliki kolom NIM, Nama, dan Kelas!"
                );

                fileCSV.value = "";

                return;

            }

            let berhasil = 0;
            let duplikat = 0;
            let tidakValid = 0;

            const nimTerdaftar = new Set(

                mahasiswa.map(mhs =>
                    mhs.nim.toLowerCase()
                )

            );

            // Memasukkan data mahasiswa
            for (let i = 1; i < baris.length; i++) {

                const nim =
                    (baris[i][posisiNim] || "").trim();

                const nama =
                    (baris[i][posisiNama] || "").trim();

                const kelas =
                    (baris[i][posisiKelas] || "").trim();

                if (!nim || !nama || !kelas) {

                    tidakValid++;

                    continue;

                }

                if (nimTerdaftar.has(nim.toLowerCase())) {

                    duplikat++;

                    continue;

                }

                mahasiswa.push({

                    nim: nim,
                    nama: nama,
                    kelas: kelas

                });

                nimTerdaftar.add(nim.toLowerCase());

                berhasil++;

            }

            // Menyimpan data
            simpanData();

            tampilkanData();

            alert(

                "IMPORT SELESAI!\n\n" +
                "Berhasil: " + berhasil + " mahasiswa\n" +
                "Duplikat: " + duplikat + " mahasiswa\n" +
                "Tidak valid: " + tidakValid + " baris"

            );

            fileCSV.value = "";

        };

        reader.onerror = function() {

            alert("File CSV gagal dibaca!");

            fileCSV.value = "";

        };

        reader.readAsText(file, "UTF-8");

    });

}


// ==================================
// FITUR EXPORT PDF
// ==================================

const tombolPDF =
    document.getElementById("downloadPDF");

if (tombolPDF) {

    tombolPDF.addEventListener("click", function() {

        window.print();

    });

}


// ==================================
// DASHBOARD TEMANTUGAS
// ==================================

function tampilkanDashboard() {

    // Mengambil data mahasiswa
    const dataMahasiswa = JSON.parse(
        localStorage.getItem("dataMahasiswa")
    ) || [];

    // Mengambil hasil randomisasi terakhir
    const hasilTerakhir = JSON.parse(
        localStorage.getItem("hasilKelompokTerakhir")
    );

    // Mengambil riwayat randomisasi
    const riwayat = JSON.parse(
        localStorage.getItem("riwayatKelompok")
    ) || [];

    // Total mahasiswa
    const totalMahasiswa =
        document.getElementById("totalMahasiswa");

    if (totalMahasiswa) {

        totalMahasiswa.textContent =
            dataMahasiswa.length;

    }

    // Jumlah kelompok terakhir
    const totalKelompok =
        document.getElementById("totalKelompok");

    if (totalKelompok) {

        const jumlah = hasilTerakhir &&
            Array.isArray(hasilTerakhir.kelompok)
            ? hasilTerakhir.kelompok.length
            : 0;

        totalKelompok.textContent = jumlah;

    }

    // Total riwayat
    const totalRiwayat =
        document.getElementById("totalRiwayat");

    if (totalRiwayat) {

        totalRiwayat.textContent =
            riwayat.length;

    }

    // Aktivitas terbaru
    const aktivitas =
        document.getElementById("aktivitasTerbaru");

    if (aktivitas) {

        aktivitas.innerHTML = "";

        if (riwayat.length === 0) {

            aktivitas.textContent =
                "Belum ada aktivitas randomisasi.";

        } else {

            const terbaru = riwayat[0];

            const jumlahKelompok =
                Array.isArray(terbaru.kelompok)
                ? terbaru.kelompok.length
                : 0;

            const jumlahPeserta =
                Array.isArray(terbaru.kelompok)
                ? terbaru.kelompok.reduce(
                    (total, anggota) =>
                        total + anggota.length,
                    0
                )
                : 0;

            const card =
                document.createElement("div");

            card.className = "history-card";

            const judul =
                document.createElement("h3");

            judul.textContent =
                "Randomisasi Terbaru";

            const tanggal =
                document.createElement("p");

            tanggal.textContent =
                "Tanggal: " + terbaru.tanggal;

            const peserta =
                document.createElement("p");

            peserta.textContent =
                "Total mahasiswa: " + jumlahPeserta;

            const kelompok =
                document.createElement("p");

            kelompok.textContent =
                "Jumlah kelompok: " + jumlahKelompok;

            const tombol =
                document.createElement("a");

            tombol.href = "hasil.html";

            tombol.textContent =
                "Lihat Hasil Kelompok →";

            card.appendChild(judul);
            card.appendChild(tanggal);
            card.appendChild(peserta);
            card.appendChild(kelompok);
            card.appendChild(tombol);

            aktivitas.appendChild(card);

        }

    }

}

// Menjalankan Dashboard
tampilkanDashboard();
