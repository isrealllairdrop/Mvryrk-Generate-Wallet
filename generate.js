// Impor Library
const bip39 = require('bip39');
const sodium = require('libsodium-wrappers');
const { blake2b } = require('blakejs');
const { b58cencode, prefix, Prefix } = require('@mavrykdynamics/taquito-utils');
const { derivePath } = require('ed25519-hd-key');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

/**
 * Membuat prompt pertanyaan interaktif di terminal.
 * @param {string} query - Teks pertanyaan yang akan ditampilkan kepada pengguna.
 * @returns {Promise<string>} Jawaban yang diberikan oleh pengguna.
 */
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

/**
 * Menghasilkan satu set wallet (private key, public key, address) dari sebuah mnemonic.
 * Fungsi ini menggunakan jalur derivasi BIP44 standar untuk Mavryk/Tezos.
 * @param {string} mnemonic - Frasa mnemonic (12 atau 24 kata).
 * @returns {Promise<object|null>} Objek wallet jika berhasil, atau null jika gagal.
 */
async function generateWalletFromMnemonic(mnemonic) {
    try {
        if (!bip39.validateMnemonic(mnemonic)) {
            console.warn(`[!] Mnemonic tidak valid, dilewati: "${mnemonic.substring(0, 20)}..."`);
            return null;
        }
        
        const derivationPath = `m/44'/1729'/0'/0'`;
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const { key } = derivePath(derivationPath, seed.toString('hex'));
        
        const keyPair = sodium.crypto_sign_seed_keypair(key);
        const publicKeyHash = blake2b(keyPair.publicKey, null, 20);

        return {
            address: b58cencode(publicKeyHash, prefix[Prefix.MV1]),
            publicKey: b58cencode(keyPair.publicKey, prefix[Prefix.EDPK]),
            privateKey: b58cencode(keyPair.privateKey, prefix[Prefix.EDSK]),
            mnemonic: mnemonic,
        };
    } catch (error) {
        console.error(`[!] Gagal memproses mnemonic "${mnemonic.substring(0,20)}...":`, error);
        return null;
    }
}

/**
 * Menyimpan array objek wallet ke dalam beberapa file (.txt dan .json) dalam folder tertentu.
 * @param {Array<object>} wallets - Array berisi objek-objek wallet yang akan disimpan.
 * @param {string} folderName - Nama folder tujuan ('Baru' atau 'Lama').
 */
async function saveWallets(wallets, folderName) {
    if (wallets.length === 0) {
        console.log("\n[INFO] Tidak ada wallet valid untuk disimpan.");
        return;
    }

    const dir = path.join(__dirname, folderName);
    await fs.mkdir(dir, { recursive: true });

    const walletData = {};
    wallets.forEach((wallet, index) => {
        walletData[`wallet${index + 1}`] = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic,
        };
    });
    
    const fileContents = {
        'address.txt': wallets.map(w => w.address).join('\n'),
        'privatekey.txt': wallets.map(w => w.privateKey).join('\n'),
        'mnemonic.txt': wallets.map(w => w.mnemonic).join('\n'),
        'wallet.json': JSON.stringify(walletData, null, 2),
    };

    for (const [fileName, content] of Object.entries(fileContents)) {
        await fs.writeFile(path.join(dir, fileName), content);
    }

    console.log(`\n[SUCCESS] ${wallets.length} wallet Mavryk berhasil disimpan ke folder "${folderName}"`);
}

/**
 * Menjalankan alur untuk membuat sejumlah wallet baru.
 */
async function handleNewWallets() {
    const countStr = await askQuestion('Berapa banyak wallet baru yang akan dibuat? ');
    const count = parseInt(countStr, 10);

    if (isNaN(count) || count <= 0) {
        console.log("[ERROR] Jumlah tidak valid. Harap masukkan angka lebih dari 0.");
        return;
    }

    console.log(`\n[INFO] Membuat ${count} wallet baru...`);
    const wallets = [];
    for (let i = 0; i < count; i++) {
        const mnemonic = bip39.generateMnemonic(128);
        const wallet = await generateWalletFromMnemonic(mnemonic);
        if (wallet) {
            wallets.push(wallet);
            console.log(`[${i + 1}] Dihasilkan: ${wallet.address}`);
        }
    }
    await saveWallets(wallets, 'Baru');
}

/**
 * Menjalankan alur untuk memproses wallet dari file mnemonic.txt.
 */
async function handleExistingMnemonics() {
    const filePath = path.join(__dirname, 'mnemonic.txt');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const mnemonics = data.split('\n').map(m => m.trim()).filter(m => m.length > 0);

        if (mnemonics.length === 0) {
            console.log(`[ERROR] File "${filePath}" kosong atau tidak berisi mnemonic yang valid.`);
            return;
        }

        console.log(`\n[INFO] Memproses ${mnemonics.length} mnemonic dari file mnemonic.txt...`);
        const wallets = [];
        for (let i = 0; i < mnemonics.length; i++) {
            const mnemonic = mnemonics[i];
            const wallet = await generateWalletFromMnemonic(mnemonic);
            if (wallet) {
                wallets.push(wallet);
                console.log(`[${i + 1}] Diproses: ${wallet.address}`);
            }
        }
        await saveWallets(wallets, 'Lama');

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`\n[ERROR] File "mnemonic.txt" tidak ditemukan di direktori ini.`);
        } else {
            console.error('\n[FATAL] Gagal membaca atau memproses file mnemonic.txt:', error);
        }
    }
}

/**
 * Fungsi utama (main) untuk menjalankan keseluruhan skrip.
 */
async function main() {
    await sodium.ready;
    
    console.clear();
    console.log("███╗   ███╗ █████╗ ██╗   ██╗ ██████╗ ███████╗███╗   ██╗");
    console.log("████╗ ████║██╔══██╗██║   ██║██╔════╝ ██╔════╝████╗  ██║");
    console.log("██╔████╔██║███████║██║   ██║██║  ███╗█████╗  ██╔██╗ ██║");
    console.log("██║╚██╔╝██║██╔══██║██║   ██║██║   ██║██╔══╝  ██║╚██╗██║");
    console.log("██║ ╚═╝ ██║██║  ██║╚██████╔╝╚██████╔╝███████╗██║ ╚████║");
    console.log("╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝");
    console.log("                by ISREALLLAIRDROP");
    console.log("      Telegram : https://t.me/Isrealll1");
    console.log("\n============================================================");

    console.log("\nSilakan pilih opsi:");
    console.log("1. Buat wallet baru");
    console.log("2. Gunakan mnemonic dari file (mnemonic.txt)");
    
    const choice = await askQuestion('\nMasukkan pilihan Anda (1 atau 2): ');

    switch (choice.trim()) {
        case '1':
            await handleNewWallets();
            break;
        case '2':
            await handleExistingMnemonics();
            break;
        default:
            console.log("[ERROR] Pilihan tidak valid. Harap jalankan kembali skrip dan pilih 1 atau 2.");
            break;
    }
}

main().catch(err => {
    console.error("\n[FATAL] Terjadi error yang tidak bisa ditangani:", err);
});
