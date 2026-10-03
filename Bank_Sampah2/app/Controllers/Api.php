<?php

namespace App\Controllers;

use CodeIgniter\Database\Exceptions\DatabaseException;
use CodeIgniter\HTTP\ResponseInterface;

class Api extends BaseController
{
    private const RUPIAH_PER_POINT = 100;
    private const RESIDENT_POINT_SHARE_PERCENT = 50;
    private const EXCLUDE_SETORAN_KAS = "NOT EXISTS (SELECT 1 FROM setoran WHERE (kas.referensi = setoran.id_setoran OR kas.referensi = CONCAT(setoran.id_setoran, '-BATAL')) AND kas.keterangan NOT LIKE 'Pembayaran tunai setoran %' AND kas.keterangan NOT LIKE 'Pembatalan pembayaran tunai setoran %')";

    public function index(): ResponseInterface
    {
        $payload = $this->request->getJSON(true);
        $input = array_merge(
            $this->request->getGet(),
            is_array($payload) ? $payload : [],
        );
        $action = $input['action'] ?? null;

        if (! is_string($action) || $action === '') {
            return $this->respond(['success' => false, 'message' => 'Action API wajib diisi.'], 400);
        }

        $writeActions = [
            'login_operator',
            'login_warga',
            'logout',
            'reset_password',
            'tambah_master_sampah',
            'ubah_master_sampah',
            'hapus_master_sampah',
            'tambah_kelompok',
            'aktifkan_kelompok',
            'hapus_kelompok',
            'tambah_akun',
            'ubah_akun',
            'hapus_akun',
            'tambah_warga',
            'ubah_warga',
            'hapus_warga',
            'simpan_setoran',
            'batalkan_setoran',
            'simpan_penjualan',
            'catat_biaya',
            'catat_dana_masuk',
            'tambah_pengumuman',
            'ubah_pengumuman',
            'hapus_pengumuman',
            'tukar_poin',
            'tambah_katalog',
            'ubah_katalog',
            'hapus_katalog',
        ];
        $isWriteAction = in_array($action, $writeActions, true);
        $method = strtoupper($this->request->getMethod());

        if (($isWriteAction && $method !== 'POST') || (! $isWriteAction && $method !== 'GET')) {
            return $this->respond(['success' => false, 'message' => 'Method HTTP tidak diizinkan untuk action ini.'], 405);
        }

        if ($isWriteAction) {
            $origin = $this->request->getHeaderLine('Origin');
            $allowedOrigins = config('Cors')->default['allowedOrigins'];
            if ($origin !== '' && ! in_array($origin, $allowedOrigins, true)) {
                return $this->respond(['success' => false, 'message' => 'Origin tidak diizinkan.'], 403);
            }
            if (
                ! is_array($payload)
                || ($payload['action'] ?? null) !== $action
                || ! str_starts_with(strtolower($this->request->getHeaderLine('Content-Type')), 'application/json')
            ) {
                return $this->respond(['success' => false, 'message' => 'Action tulis harus dikirim sebagai JSON melalui body POST.'], 400);
            }
        }

        if ($action === 'ping') {
            return $this->respond(['success' => true, 'message' => 'API CodeIgniter aktif.']);
        }

        if ($action === 'logout') {
            return $this->logout();
        }

        $publicActions = ['login_operator', 'login_warga', 'pengumuman', 'get_katalog'];
        $identity = null;
        if (! in_array($action, $publicActions, true)) {
            $identity = $this->authenticatedIdentity();
            if ($identity === null) {
                return $this->respond(['success' => false, 'message' => 'Sesi tidak valid. Silakan login kembali.'], 401);
            }
        }

        if ($identity !== null && $identity['type'] === 'warga') {
            $residentActions = ['profil_warga', 'riwayat_setoran', 'pengumuman', 'get_katalog'];
            if (! in_array($action, $residentActions, true)) {
                return $this->respond(['success' => false, 'message' => 'Akses hanya tersedia untuk pengelola.'], 403);
            }
            if (in_array($action, ['profil_warga', 'riwayat_setoran'], true)) {
                $input['username'] = $identity['username'];
            }
        }

        try {
            return match ($action) {
                'login_operator' => $this->loginOperator($input),
                'login_warga' => $this->loginWarga($input),
                'reset_password' => $this->resetPassword($input),
                'master_sampah' => $this->listRows('master_sampah', 'nama'),
                'tambah_master_sampah' => $this->createMasterSampah($input),
                'ubah_master_sampah' => $this->updateMasterSampah($input),
                'hapus_master_sampah' => $this->deleteById('master_sampah', 'kode', $input),
                'kelompok_aktif' => $this->listRows('kelompok_kegiatan', 'tanggal_mulai', true),
                'tambah_kelompok' => $this->createKelompok($input),
                'aktifkan_kelompok' => $this->activateKelompok($input),
                'hapus_kelompok' => $this->deleteById('kelompok_kegiatan', 'id_kelompok', $input),
                'akun', 'get_akun' => $this->listOperators(),
                'detail_akun' => $this->getById('operator', 'id_operator', $input),
                'tambah_akun' => $this->createOperator($input),
                'ubah_akun' => $this->updateOperator($input),
                'hapus_akun' => $this->deleteById('operator', 'id_operator', $input),
                'profil_warga' => $this->getById('warga', 'username', $input),
                'riwayat_setoran' => $this->listRows('setoran', 'tanggal', false, 'username', $input),
                'get_warga' => $this->listRows('warga', 'nama'),
                'tambah_warga' => $this->createWarga($input),
                'ubah_warga' => $this->updateWarga($input),
                'hapus_warga' => $this->deleteById('warga', 'id_warga', $input),
                'simpan_setoran' => $this->createSetoran($input),
                'detail_setoran' => $this->detailSetoran($input),
                'riwayat_transaksi' => $this->getRiwayatTransaksi(),
                'batalkan_setoran' => $this->cancelSetoran($input),
                'stok' => $this->getStok(),
                'simpan_penjualan' => $this->createPenjualan($input),
                'dashboard' => $this->getDashboard(),
                'saldo_kas' => $this->getSaldoKas(),
                'riwayat_kas' => $this->listKas(),
                'laporan' => $this->getLaporan($input),
                'catat_biaya' => $this->createKas($input, 'KELUAR'),
                'catat_dana_masuk' => $this->createKas($input, 'MASUK'),
                'pengumuman' => $this->listRows('pengumuman', 'tanggal', true),
                'tambah_pengumuman' => $this->createPengumuman($input),
                'ubah_pengumuman' => $this->updatePengumuman($input),
                'hapus_pengumuman' => $this->deleteById('pengumuman', 'id_pengumuman', $input),
                'tukar_poin' => $this->createTukarPoin($input),
                'riwayat_tukar_poin' => $this->listRows('tukar_poin', 'tanggal', false, 'username_warga', $input, 'username', true),
                'get_katalog' => $this->listRows('katalog', 'nama', true),
                'get_katalog_admin' => $this->listRows('katalog', 'nama'),
                'tambah_katalog' => $this->createKatalog($input),
                'ubah_katalog' => $this->updateKatalog($input),
                'hapus_katalog' => $this->deleteById('katalog', 'id_katalog', $input),
                default => $this->respond(['success' => false, 'message' => 'Action API tidak ditemukan.'], 404),
            };
        } catch (\InvalidArgumentException $exception) {
            return $this->respond(['success' => false, 'message' => $exception->getMessage()], 400);
        } catch (\JsonException $exception) {
            return $this->respond(['success' => false, 'message' => 'Format JSON tidak valid.'], 400);
        } catch (DatabaseException $exception) {
            log_message('error', 'Permintaan API gagal mengakses database: {message}', [
                'message' => $exception->getMessage(),
            ]);

            return $this->respond(['success' => false, 'message' => 'Permintaan database gagal diproses.'], 500);
        }
    }

    public function options(): ResponseInterface
    {
        return $this->response->setStatusCode(204);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function loginOperator(array $input): ResponseInterface
    {
        $username = trim((string) ($input['username'] ?? ''));
        $password = (string) ($input['password'] ?? '');

        if ($username === '' || $password === '') {
            return $this->respond(['success' => false, 'message' => 'Username dan password wajib diisi.'], 400);
        }

        $operator = db_connect()
            ->table('operator')
            ->where('username', $username)
            ->get()
            ->getRowArray();

        if (
            $operator === null
            || strtoupper((string) ($operator['status'] ?? '')) !== 'AKTIF'
            || ! password_verify($password, (string) ($operator['password'] ?? ''))
        ) {
            return $this->respond(['success' => false, 'message' => 'Username atau password salah.'], 401);
        }

        $this->startAuthenticatedSession([
            'type' => 'operator',
            'id' => $operator['id_operator'],
        ]);

        return $this->respond([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'id_operator' => $operator['id_operator'],
                'nama' => $operator['nama'],
                'username' => $operator['username'],
                'no_hp' => $operator['no_hp'],
                'role' => $operator['role'],
                'status' => $operator['status'],
            ],
        ]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function loginWarga(array $input): ResponseInterface
    {
        $warga = db_connect()
            ->table('warga')
            ->where('username', $this->required($input, 'username'))
            ->where('no_hp', $this->required($input, 'no_hp'))
            ->get()
            ->getRowArray();

        if ($warga === null) {
            return $this->respond(['success' => false, 'message' => 'Username atau nomor HP tidak cocok.'], 401);
        }

        $this->startAuthenticatedSession([
            'type' => 'warga',
            'id' => $warga['id_warga'],
        ]);

        return $this->respond(['success' => true, 'message' => 'Login berhasil.', 'data' => $warga]);
    }

    private function logout(): ResponseInterface
    {
        $session = service('session');
        $session->start();
        $session->destroy();

        return $this->respond(['success' => true, 'message' => 'Logout berhasil.']);
    }

    /**
     * @param array{type: 'operator'|'warga', id: string} $identity
     */
    private function startAuthenticatedSession(array $identity): void
    {
        $session = service('session');
        $session->start();
        $session->regenerate(true);
        $session->set([
            'auth_type' => $identity['type'],
            'auth_id' => $identity['id'],
        ]);
    }

    /**
     * @return array{type: 'operator'|'warga', username: string}|null
     */
    private function authenticatedIdentity(): ?array
    {
        $session = service('session');
        $session->start();
        $type = $session->get('auth_type');
        $id = $session->get('auth_id');

        if (! is_string($id) || $id === '') {
            return null;
        }

        if ($type === 'operator') {
            $operator = db_connect()->table('operator')
                ->select('id_operator, username, status')
                ->where('id_operator', $id)
                ->get()
                ->getRowArray();

            if ($operator === null || strtoupper((string) $operator['status']) !== 'AKTIF') {
                $session->destroy();

                return null;
            }

            return ['type' => 'operator', 'username' => (string) $operator['username']];
        }

        if ($type === 'warga') {
            $warga = db_connect()->table('warga')
                ->select('id_warga, username')
                ->where('id_warga', $id)
                ->get()
                ->getRowArray();

            if ($warga === null) {
                $session->destroy();

                return null;
            }

            return ['type' => 'warga', 'username' => (string) $warga['username']];
        }

        $session->destroy();

        return null;
    }

    /**
     * @param array<string, mixed> $input
     */
    private function resetPassword(array $input): ResponseInterface
    {
        $username = $this->required($input, 'username');
        $noHp = $this->required($input, 'no_hp');
        $password = $this->required($input, 'new_password');
        if (strlen($password) < 6) {
            throw new \InvalidArgumentException('Password minimal 6 karakter.');
        }
        $operator = db_connect()
            ->table('operator')
            ->where('username', $username)
            ->where('no_hp', $noHp)
            ->get()
            ->getRowArray();

        if ($operator === null) {
            return $this->respond(['success' => false, 'message' => 'Username atau nomor HP tidak terdaftar.'], 404);
        }

        db_connect()->table('operator')
            ->where('id_operator', $operator['id_operator'])
            ->update(['password' => password_hash($password, PASSWORD_DEFAULT)]);

        return $this->respond(['success' => true, 'message' => 'Password berhasil diubah.']);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function listOperators(): ResponseInterface
    {
        $rows = db_connect()->table('operator')
            ->select('id_operator, nama, username, no_hp, role, status')
            ->orderBy('nama')
            ->get()
            ->getResultArray();

        return $this->respond(['success' => true, 'akun' => $rows, 'data' => ['akun' => $rows]]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createOperator(array $input): ResponseInterface
    {
        $data = [
            'id_operator' => $this->newId('OPR'),
            'nama' => $this->required($input, 'nama'),
            'username' => $this->required($input, 'username'),
            'no_hp' => $this->required($input, 'no_hp'),
            'password' => password_hash($this->required($input, 'password'), PASSWORD_DEFAULT),
            'role' => $this->value($input, 'role', 'admin'),
            'status' => strtoupper($this->value($input, 'status', 'aktif')),
        ];
        db_connect()->table('operator')->insert($data);

        return $this->created('id_operator', $data['id_operator']);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function updateOperator(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_operator');
        $data = $this->only($input, ['nama', 'username', 'no_hp', 'role', 'status']);
        if (isset($data['status'])) {
            $data['status'] = strtoupper((string) $data['status']);
        }
        if (isset($input['password']) && trim((string) $input['password']) !== '') {
            $data['password'] = password_hash((string) $input['password'], PASSWORD_DEFAULT);
        }

        return $this->updateById('operator', 'id_operator', $id, $data);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createWarga(array $input): ResponseInterface
    {
        $data = [
            'id_warga' => $this->newId('WRG'),
            'nama' => $this->required($input, 'nama'),
            'username' => $this->required($input, 'username'),
            'no_hp' => $this->value($input, 'no_hp', ''),
            'poin' => 0,
            'total_setoran_kg' => 0,
            'total_nilai_rupiah' => 0,
            'rt' => $this->value($input, 'rt', '-'),
        ];
        db_connect()->table('warga')->insert($data);

        return $this->created('id_warga', $data['id_warga']);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function updateWarga(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_warga');
        $data = $this->only($input, ['nama', 'username', 'no_hp', 'rt']);

        return $this->updateById('warga', 'id_warga', $id, $data);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createMasterSampah(array $input): ResponseInterface
    {
        $data = [
            'kode' => strtoupper($this->required($input, 'kode')),
            'nama' => $this->required($input, 'nama'),
            'harga_beli' => $this->number($input, 'harga_beli'),
            'harga_jual' => $this->number($input, 'harga_jual'),
            'status' => strtoupper($this->value($input, 'status', 'AKTIF')),
        ];
        db_connect()->table('master_sampah')->insert($data);

        return $this->created('kode', $data['kode']);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function updateMasterSampah(array $input): ResponseInterface
    {
        $id = strtoupper($this->required($input, 'kode'));
        $data = $this->only($input, ['nama', 'harga_beli', 'harga_jual', 'status']);
        if (isset($data['status'])) {
            $data['status'] = strtoupper((string) $data['status']);
        }

        return $this->updateById('master_sampah', 'kode', $id, $data);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createKelompok(array $input): ResponseInterface
    {
        $id = $this->newId('KLP');
        db_connect()->table('kelompok_kegiatan')->insert([
            'id_kelompok' => $id,
            'nama_kelompok' => $this->required($input, 'nama_kelompok'),
            'tanggal_mulai' => date('Y-m-d H:i:s'),
            'status' => 'AKTIF',
        ]);

        return $this->created('id_kelompok', $id);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function activateKelompok(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_kelompok');
        $db = db_connect();
        $db->transBegin();
        $db->table('kelompok_kegiatan')->update(['status' => 'NONAKTIF']);
        $db->table('kelompok_kegiatan')->where('id_kelompok', $id)->update(['status' => 'AKTIF']);
        if ($db->affectedRows() !== 1 || $db->transStatus() === false) {
            $db->transRollback();

            return $this->respond(['success' => false, 'message' => 'Kelompok tidak ditemukan.'], 404);
        }
        $db->transCommit();

        return $this->respond(['success' => true, 'message' => 'Kelompok berhasil diaktifkan.']);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createSetoran(array $input): ResponseInterface
    {
        $username = $this->required($input, 'username');
        $items = $this->parseItems($input);
        $db = db_connect();
        $warga = $db->table('warga')->where('username', $username)->get()->getRowArray();
        if ($warga === null) {
            throw new \InvalidArgumentException('Warga tidak ditemukan.');
        }

        $rows = [];
        $totalKg = 0.0;
        $totalRupiah = 0.0;
        foreach ($items as $item) {
            $master = $db->table('master_sampah')->where('kode', strtoupper((string) ($item['kode'] ?? '')))->get()->getRowArray();
            if ($master === null || strtoupper((string) $master['status']) !== 'AKTIF') {
                throw new \InvalidArgumentException('Jenis sampah tidak ditemukan atau tidak aktif.');
            }
            $berat = $this->itemWeight($item);
            $subtotal = $berat * (float) $master['harga_beli'];
            $rows[] = [
                'kode' => $master['kode'],
                'nama' => $master['nama'],
                'berat' => $berat,
                'harga' => $master['harga_beli'],
                'subtotal' => $subtotal,
            ];
            $totalKg += $berat;
            $totalRupiah += $subtotal;
        }

        $paymentMethod = strtoupper($this->value($input, 'metode_pembayaran', 'POIN'));
        if (! in_array($paymentMethod, ['POIN', 'TUNAI'], true)) {
            throw new \InvalidArgumentException('Metode penerimaan harus berupa POIN atau TUNAI.');
        }
        $residentShare = round($totalRupiah * self::RESIDENT_POINT_SHARE_PERCENT / 100);
        $totalPoints = $paymentMethod === 'POIN'
            ? (int) round($residentShare / self::RUPIAH_PER_POINT)
            : 0;
        $id = $this->newId('STR');
        $db->transBegin();
        $db->table('setoran')->insert([
            'id_setoran' => $id,
            'id_kelompok' => $input['id_kelompok'] ?? null,
            'tanggal' => date('Y-m-d H:i:s'),
            'username' => $username,
            'nama' => $this->value($input, 'nama', (string) $warga['nama']),
            'nama_warga' => $this->value($input, 'nama_warga', (string) $warga['nama']),
            'rt' => $this->value($input, 'rt', (string) $warga['rt']),
            'total_kg' => $totalKg,
            'total_rupiah' => $totalRupiah,
            'total_poin' => $totalPoints,
            'status' => 'SELESAI',
        ]);
        foreach ($rows as $row) {
            $row['id_setoran'] = $id;
            $db->table('setoran_item')->insert($row);
        }
        $db->table('warga')
            ->where('id_warga', $warga['id_warga'])
            ->set('poin', 'poin + ' . $totalPoints, false)
            ->set('total_setoran_kg', 'total_setoran_kg + ' . $totalKg, false)
            ->set('total_nilai_rupiah', 'total_nilai_rupiah + ' . $totalRupiah, false)
            ->update();
        if ($paymentMethod === 'TUNAI') {
            $this->insertKas($db, 'KELUAR', $residentShare, 'Pembayaran tunai setoran ' . $warga['nama'], $id);
        }
        $this->commitOrFail($db);

        return $this->respond([
            'success' => true,
            'message' => 'Setoran berhasil disimpan.',
            'data' => [
                'id_setoran' => $id,
                'total_kg' => $totalKg,
                'total_rupiah' => $totalRupiah,
                'total_poin' => $totalPoints,
                'metode_pembayaran' => $paymentMethod,
                'nilai_dibayarkan' => $paymentMethod === 'TUNAI' ? $residentShare : 0,
            ],
        ]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function detailSetoran(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_setoran');
        $header = db_connect()->table('setoran')->where('id_setoran', $id)->get()->getRowArray();
        if ($header === null) {
            return $this->respond(['success' => false, 'message' => 'Setoran tidak ditemukan.'], 404);
        }
        $cashPayout = db_connect()->table('kas')
            ->where('referensi', $id)
            ->where('jenis', 'KELUAR')
            ->like('keterangan', 'Pembayaran tunai setoran ', 'after')
            ->get()
            ->getRowArray();
        $header['metode_pembayaran'] = $cashPayout === null ? 'POIN' : 'TUNAI';
        $header['nilai_dibayarkan'] = (float) ($cashPayout['nominal'] ?? 0);
        $header['items'] = db_connect()->table('setoran_item')->where('id_setoran', $id)->get()->getResultArray();

        return $this->respond(['success' => true, 'data' => $header]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function cancelSetoran(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_setoran');
        $db = db_connect();
        $header = $db->table('setoran')->where('id_setoran', $id)->get()->getRowArray();
        if ($header === null || strtoupper((string) $header['status']) !== 'SELESAI') {
            return $this->respond(['success' => false, 'message' => 'Setoran tidak ditemukan atau sudah dibatalkan.'], 404);
        }

        $db->transBegin();
        $db->table('setoran')->where('id_setoran', $id)->where('status', 'SELESAI')->update(['status' => 'BATAL']);
        if ($db->affectedRows() !== 1) {
            $db->transRollback();

            return $this->respond(['success' => false, 'message' => 'Setoran tidak ditemukan atau sudah dibatalkan.'], 404);
        }
        $db->table('warga')
            ->where('username', $header['username'])
            ->set('poin', 'GREATEST(poin - ' . (int) $header['total_poin'] . ', 0)', false)
            ->set('total_setoran_kg', 'GREATEST(total_setoran_kg - ' . (float) $header['total_kg'] . ', 0)', false)
            ->set('total_nilai_rupiah', 'GREATEST(total_nilai_rupiah - ' . (float) $header['total_rupiah'] . ', 0)', false)
            ->update();
        $cashPayout = $db->table('kas')
            ->where('referensi', $id)
            ->where('jenis', 'KELUAR')
            ->like('keterangan', 'Pembayaran tunai setoran ', 'after')
            ->get()
            ->getRowArray();
        if ($cashPayout !== null) {
            $this->insertKas(
                $db,
                'MASUK',
                (float) $cashPayout['nominal'],
                'Pembatalan pembayaran tunai setoran ' . $id,
                $id . '-BATAL',
            );
        }
        $this->commitOrFail($db);

        return $this->respond(['success' => true, 'message' => 'Setoran berhasil dibatalkan.']);
    }

    private function getStok(): ResponseInterface
    {
        $master = db_connect()->table('master_sampah')->where('status', 'AKTIF')->orderBy('nama')->get()->getResultArray();
        $stock = [];
        foreach ($master as $item) {
            $incoming = (float) (db_connect()->table('setoran_item si')
                ->selectSum('si.berat', 'total')
                ->join('setoran s', 's.id_setoran = si.id_setoran')
                ->where('si.kode', $item['kode'])
                ->where('s.status', 'SELESAI')
                ->get()->getRowArray()['total'] ?? 0);
            $outgoing = (float) (db_connect()->table('penjualan_item pi')
                ->selectSum('pi.berat', 'total')
                ->join('penjualan p', 'p.id_penjualan = pi.id_penjualan')
                ->where('pi.kode', $item['kode'])
                ->where('p.status', 'SELESAI')
                ->get()->getRowArray()['total'] ?? 0);
            $stock[] = ['kode' => $item['kode'], 'nama' => $item['nama'], 'stok' => $incoming - $outgoing];
        }

        return $this->respond(['success' => true, 'data' => $stock]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createPenjualan(array $input): ResponseInterface
    {
        $items = $this->parseItems($input);
        $db = db_connect();
        $rows = [];
        $requestedByCode = [];
        $totalKg = 0.0;
        $total = 0.0;
        foreach ($items as $item) {
            $kode = strtoupper((string) ($item['kode'] ?? ''));
            $master = $db->table('master_sampah')->where('kode', $kode)->get()->getRowArray();
            if ($master === null || strtoupper((string) $master['status']) !== 'AKTIF') {
                throw new \InvalidArgumentException('Jenis sampah tidak ditemukan atau tidak aktif.');
            }
            $berat = $this->itemWeight($item);
            $requestedByCode[$kode] = ($requestedByCode[$kode] ?? 0) + $berat;
            $harga = (float) $master['harga_jual'];
            $subtotal = $berat * $harga;
            $rows[] = ['kode' => $kode, 'nama' => $master['nama'], 'berat' => $berat, 'harga' => $harga, 'subtotal' => $subtotal];
            $totalKg += $berat;
            $total += $subtotal;
        }
        $db->transBegin();
        foreach ($requestedByCode as $kode => $requested) {
            $db->query('SELECT kode FROM master_sampah WHERE kode = ? FOR UPDATE', [$kode]);
            $incoming = (float) ($db->table('setoran_item si')
                ->selectSum('si.berat', 'total')
                ->join('setoran s', 's.id_setoran = si.id_setoran')
                ->where('si.kode', $kode)
                ->where('s.status', 'SELESAI')
                ->get()->getRowArray()['total'] ?? 0);
            $outgoing = (float) ($db->table('penjualan_item pi')
                ->selectSum('pi.berat', 'total')
                ->join('penjualan p', 'p.id_penjualan = pi.id_penjualan')
                ->where('pi.kode', $kode)
                ->where('p.status', 'SELESAI')
                ->get()->getRowArray()['total'] ?? 0);
            if ($requested > $incoming - $outgoing) {
                $db->transRollback();

                throw new \InvalidArgumentException('Stok ' . $kode . ' tidak mencukupi.');
            }
        }

        $id = $this->newId('JUAL');
        $db->table('penjualan')->insert([
            'id_penjualan' => $id,
            'tanggal' => date('Y-m-d H:i:s'),
            'nama_pengepul' => $this->required($input, 'nama_pengepul'),
            'total_kg' => $totalKg,
            'total_penjualan' => $total,
            'status' => 'SELESAI',
        ]);
        foreach ($rows as $row) {
            $row['id_penjualan'] = $id;
            $db->table('penjualan_item')->insert($row);
        }
        $this->insertKas($db, 'MASUK', $total, 'Penjualan kepada ' . $input['nama_pengepul'], $id);
        $this->commitOrFail($db);

        return $this->respond(['success' => true, 'message' => 'Penjualan berhasil disimpan.', 'data' => ['id_penjualan' => $id, 'total_kg' => $totalKg, 'total_penjualan' => $total]]);
    }

    private function getDashboard(): ResponseInterface
    {
        $db = db_connect();
        $row = $db->table('warga')->select('COUNT(*) AS total_warga, COALESCE(SUM(total_setoran_kg), 0) AS total_setoran_kg, COALESCE(SUM(poin), 0) AS total_poin')->get()->getRowArray();
        $sales = $db->table('penjualan')->selectSum('total_penjualan')->where('status', 'SELESAI')->get()->getRowArray();
        $cash = $this->saldoKas();

        return $this->respond(['success' => true, 'data' => [
            'total_warga' => (int) $row['total_warga'],
            'total_setoran_kg' => (float) $row['total_setoran_kg'],
            'total_poin' => (int) $row['total_poin'],
            'total_penjualan' => (float) ($sales['total_penjualan'] ?? 0),
            'saldo_kas' => $cash,
        ]]);
    }

    private function getSaldoKas(): ResponseInterface
    {
        $saldo = $this->saldoKas();

        return $this->respond(['success' => true, 'data' => ['saldo' => $saldo, 'saldo_kas' => $saldo]]);
    }

    private function listKas(): ResponseInterface
    {
        $rows = db_connect()->table('kas')
            ->where(self::EXCLUDE_SETORAN_KAS, null, false)
            ->orderBy('tanggal', 'DESC')
            ->get()
            ->getResultArray();

        return $this->respond(['success' => true, 'data' => $rows]);
    }

    private function saldoKas(): float
    {
        $row = db_connect()->table('kas')
            ->select("COALESCE(SUM(CASE WHEN jenis = 'MASUK' THEN nominal ELSE -nominal END), 0) AS saldo", false)
            ->where(self::EXCLUDE_SETORAN_KAS, null, false)
            ->get()
            ->getRowArray();

        return (float) ($row['saldo'] ?? 0);
    }

    private function getRiwayatTransaksi(): ResponseInterface
    {
        $db = db_connect();
        $deposits = $db->table('setoran s')
            ->select("s.id_setoran AS id, s.tanggal, s.nama, s.nama_warga, s.username, s.total_kg, s.total_rupiah, s.total_poin, s.status, CASE WHEN kas.id_kas IS NULL THEN 'POIN' ELSE 'TUNAI' END AS metode_pembayaran, COALESCE(kas.nominal, 0) AS nilai_dibayarkan", false)
            ->join('kas', "kas.referensi = s.id_setoran AND kas.jenis = 'KELUAR' AND kas.keterangan LIKE 'Pembayaran tunai setoran %'", 'left')
            ->get()
            ->getResultArray();
        $sales = $db->table('penjualan')
            ->select('id_penjualan AS id, tanggal, nama_pengepul AS nama, total_kg, total_penjualan AS total_rupiah, status')
            ->get()
            ->getResultArray();
        foreach ($deposits as &$deposit) {
            $deposit['tipe'] = 'setoran';
        }
        unset($deposit);
        foreach ($sales as &$sale) {
            $sale['tipe'] = 'penjualan';
        }
        unset($sale);

        $rows = array_merge($deposits, $sales);
        usort($rows, static fn (array $a, array $b): int => strcmp((string) $b['tanggal'], (string) $a['tanggal']));

        return $this->respond(['success' => true, 'data' => $rows]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function getLaporan(array $input): ResponseInterface
    {
        $bulan = (int) $this->required($input, 'bulan');
        $tahun = (int) $this->required($input, 'tahun');
        if ($bulan < 1 || $bulan > 12 || $tahun < 2000 || $tahun > 2100) {
            throw new \InvalidArgumentException('Bulan atau tahun laporan tidak valid.');
        }
        $start = sprintf('%04d-%02d-01 00:00:00', $tahun, $bulan);
        $end = date('Y-m-d H:i:s', strtotime($start . ' +1 month'));
        $db = db_connect();
        $deposits = $db->table('setoran')->select('COUNT(*) AS total_transaksi, COALESCE(SUM(total_kg), 0) AS total_kg, COALESCE(SUM(total_rupiah), 0) AS total_rupiah')->where('status', 'SELESAI')->where('tanggal >=', $start)->where('tanggal <', $end)->get()->getRowArray();
        $sales = $db->table('penjualan')->select('COUNT(*) AS total_transaksi, COALESCE(SUM(total_kg), 0) AS total_kg, COALESCE(SUM(total_penjualan), 0) AS total_rupiah')->where('status', 'SELESAI')->where('tanggal >=', $start)->where('tanggal <', $end)->get()->getRowArray();
        $cashRows = $db->table('kas')
            ->select('jenis, COALESCE(SUM(nominal), 0) AS total')
            ->where(self::EXCLUDE_SETORAN_KAS, null, false)
            ->where('tanggal >=', $start)
            ->where('tanggal <', $end)
            ->groupBy('jenis')
            ->get()
            ->getResultArray();

        return $this->respond(['success' => true, 'data' => ['bulan' => $bulan, 'tahun' => $tahun, 'setoran' => $deposits, 'penjualan' => $sales, 'kas' => $cashRows]]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createKas(array $input, string $jenis): ResponseInterface
    {
        $nominal = $this->number($input, 'nominal');
        if ($nominal <= 0) {
            throw new \InvalidArgumentException('Nominal harus lebih besar dari nol.');
        }
        $id = $this->newId('KAS');
        $this->insertKas(db_connect(), $jenis, $nominal, $this->required($input, 'keterangan'), $id);

        return $this->created('id_kas', $id);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createPengumuman(array $input): ResponseInterface
    {
        $id = $this->newId('PNG');
        db_connect()->table('pengumuman')->insert([
            'id_pengumuman' => $id,
            'tanggal' => date('Y-m-d H:i:s'),
            'judul' => $this->required($input, 'judul'),
            'isi' => $this->required($input, 'isi'),
            'status' => strtoupper($this->value($input, 'status', 'AKTIF')),
        ]);

        return $this->created('id_pengumuman', $id);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function updatePengumuman(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_pengumuman');
        $data = $this->only($input, ['judul', 'isi', 'status']);
        if (isset($data['status'])) {
            $data['status'] = strtoupper((string) $data['status']);
        }

        return $this->updateById('pengumuman', 'id_pengumuman', $id, $data);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createTukarPoin(array $input): ResponseInterface
    {
        $username = $this->required($input, 'username_warga');
        $redemptionType = strtoupper($this->value($input, 'jenis_penukaran', 'BARANG'));
        if (! in_array($redemptionType, ['BARANG', 'UANG'], true)) {
            throw new \InvalidArgumentException('Jenis penukaran harus berupa BARANG atau UANG.');
        }

        if ($redemptionType === 'UANG') {
            return $this->createTukarPoinUang($input, $username);
        }

        $items = $input['katalog_json'] ?? [];
        if (is_string($items)) {
            $items = json_decode($items, true, 512, JSON_THROW_ON_ERROR);
        }
        if (! is_array($items) || $items === []) {
            throw new \InvalidArgumentException('Data penukaran poin tidak valid.');
        }

        $id = $this->newId('TP');
        $db = db_connect();
        $poin = 0;
        $products = [];
        foreach ($items as $item) {
            if (! is_array($item)) {
                throw new \InvalidArgumentException('Data produk penukaran tidak valid.');
            }
            $productId = trim((string) ($item['id'] ?? ''));
            $qty = filter_var($item['qty'] ?? null, FILTER_VALIDATE_INT);
            if ($productId === '' || $qty === false || $qty < 1) {
                throw new \InvalidArgumentException('Produk atau jumlah penukaran tidak valid.');
            }
            $product = $db->table('katalog')->where('id_katalog', $productId)->where('status', 'AKTIF')->get()->getRowArray();
            if ($product === null) {
                throw new \InvalidArgumentException('Produk katalog tidak ditemukan atau tidak aktif.');
            }
            $poin += (int) $product['poin'] * $qty;
            $products[] = ['id' => $productId, 'qty' => $qty];
        }
        $requestedPoints = $this->number($input, 'poin_digunakan');
        if ($poin <= 0 || $requestedPoints !== (float) $poin) {
            throw new \InvalidArgumentException('Jumlah poin tidak sesuai dengan produk yang dipilih.');
        }

        $db->transBegin();
        $updated = $db->table('warga')->where('username', $username)->where('poin >=', $poin)->set('poin', 'poin - ' . (int) $poin, false)->update();
        if (! $updated || $db->affectedRows() !== 1) {
            $db->transRollback();

            return $this->respond(['success' => false, 'message' => 'Warga tidak ditemukan atau poin tidak mencukupi.'], 400);
        }
        foreach ($products as $item) {
            $productId = $item['id'];
            $qty = $item['qty'];
            $db->table('katalog')->where('id_katalog', $productId)->where('stok >=', $qty)->set('stok', 'stok - ' . $qty, false)->update();
            if ($db->affectedRows() !== 1) {
                $db->transRollback();

                return $this->respond(['success' => false, 'message' => 'Stok katalog tidak mencukupi.'], 400);
            }
        }
        $db->table('tukar_poin')->insert([
            'id_tukar' => $id,
            'tanggal' => date('Y-m-d H:i:s'),
            'username_warga' => $username,
            'nama_warga' => $this->value($input, 'nama_warga', ''),
            'no_hp' => $this->value($input, 'no_hp', ''),
            'poin_digunakan' => (int) $poin,
            'status' => strtoupper($this->value($input, 'status', 'DIPROSES')),
            'petugas' => $this->value($input, 'petugas', ''),
            'katalog_json' => json_encode($items, JSON_THROW_ON_ERROR),
            'catatan' => $this->value($input, 'catatan', ''),
        ]);
        $this->insertKas(
            $db,
            'KELUAR',
            $poin * self::RUPIAH_PER_POINT,
            'Penukaran poin warga ' . $username,
            $id,
        );
        $this->commitOrFail($db);

        return $this->created('id_tukar', $id);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createTukarPoinUang(array $input, string $username): ResponseInterface
    {
        $points = $this->number($input, 'poin_digunakan');
        if ($points <= 0 || floor($points) !== $points) {
            throw new \InvalidArgumentException('Jumlah poin untuk ditukar harus bilangan bulat lebih besar dari nol.');
        }

        $db = db_connect();
        $id = $this->newId('TP');
        $cash = (int) $points * self::RUPIAH_PER_POINT;
        $db->transBegin();

        $updated = $db->table('warga')
            ->where('username', $username)
            ->where('poin >=', (int) $points)
            ->set('poin', 'poin - ' . (int) $points, false)
            ->update();
        if (! $updated || $db->affectedRows() !== 1) {
            $db->transRollback();

            return $this->respond(['success' => false, 'message' => 'Warga tidak ditemukan atau poin tidak mencukupi.'], 400);
        }

        $warga = $db->table('warga')->where('username', $username)->get()->getRowArray();
        if ($warga === null) {
            $db->transRollback();

            return $this->respond(['success' => false, 'message' => 'Warga tidak ditemukan.'], 404);
        }

        $petugas = $this->value($input, 'petugas', 'Operator');
        $this->insertKas($db, 'KELUAR', $cash, 'Penukaran poin menjadi uang warga ' . $username, $id);
        $db->table('tukar_poin')->insert([
            'id_tukar' => $id,
            'tanggal' => date('Y-m-d H:i:s'),
            'username_warga' => $username,
            'nama_warga' => $this->value($input, 'nama_warga', (string) $warga['nama']),
            'no_hp' => $this->value($input, 'no_hp', (string) $warga['no_hp']),
            'poin_digunakan' => (int) $points,
            'status' => 'SELESAI',
            'petugas' => $petugas,
            'katalog_json' => json_encode([], JSON_THROW_ON_ERROR),
            'catatan' => 'Penukaran tunai Rp' . number_format($cash, 0, ',', '.') . ' oleh ' . $petugas,
        ]);
        $this->commitOrFail($db);

        return $this->respond([
            'success' => true,
            'message' => 'Poin berhasil ditukar menjadi uang tunai.',
            'data' => [
                'id_tukar' => $id,
                'jenis_penukaran' => 'UANG',
                'poin_digunakan' => (int) $points,
                'nominal_uang' => $cash,
                'saldo_poin' => (int) $warga['poin'],
            ],
        ]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function createKatalog(array $input): ResponseInterface
    {
        $id = $this->newId('KT');
        db_connect()->table('katalog')->insert([
            'id_katalog' => $id,
            'nama' => $this->required($input, 'nama'),
            'kategori' => $this->value($input, 'kategori', ''),
            'satuan' => $this->value($input, 'satuan', 'pcs'),
            'poin' => (int) $this->number($input, 'poin'),
            'stok' => (int) $this->number($input, 'stok', 0),
            'image' => $this->value($input, 'image', ''),
            'status' => strtoupper($this->value($input, 'status', 'AKTIF')),
        ]);

        return $this->created('id_katalog', $id);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function updateKatalog(array $input): ResponseInterface
    {
        $id = $this->required($input, 'id_katalog');
        $data = $this->only($input, ['nama', 'kategori', 'satuan', 'poin', 'stok', 'image', 'status']);
        if (isset($data['status'])) {
            $data['status'] = strtoupper((string) $data['status']);
        }

        return $this->updateById('katalog', 'id_katalog', $id, $data);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function listRows(string $table, string $orderBy, bool $activeOnly = false, ?string $filterColumn = null, array $input = [], ?string $filterInput = null, bool $optionalFilter = false): ResponseInterface
    {
        $builder = db_connect()->table($table);
        if ($activeOnly && $table !== 'kelompok_kegiatan') {
            $builder->where('status', 'AKTIF');
        }
        if ($activeOnly && $table === 'kelompok_kegiatan') {
            $builder->where('status', 'AKTIF');
        }
        if ($filterColumn !== null) {
            $filterValue = $input[$filterInput ?? $filterColumn] ?? '';
            if ($filterValue === '' && ! $optionalFilter) {
                throw new \InvalidArgumentException('Parameter ' . ($filterInput ?? $filterColumn) . ' wajib diisi.');
            }
            if ($filterValue !== '') {
                $builder->where($filterColumn, $filterValue);
            }
        }
        $rows = $builder->orderBy($orderBy, 'DESC')->get()->getResultArray();

        return $this->respond(['success' => true, 'data' => $rows]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function getById(string $table, string $column, array $input): ResponseInterface
    {
        $row = db_connect()->table($table)->where($column, $this->required($input, $column))->get()->getRowArray();
        if ($row === null) {
            return $this->respond(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }
        if ($table === 'operator') {
            unset($row['password']);
        }

        return $this->respond(['success' => true, 'data' => $row]);
    }

    /**
     * @param array<string, mixed> $input
     */
    private function deleteById(string $table, string $column, array $input): ResponseInterface
    {
        $id = $this->required($input, $column);
        $builder = db_connect()->table($table)->where($column, $id);
        if ($builder->countAllResults() === 0) {
            return $this->respond(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }
        db_connect()->table($table)->where($column, $id)->delete();

        return $this->respond(['success' => true, 'message' => 'Data berhasil dihapus.']);
    }

    /**
     * @param array<string, mixed> $data
     */
    private function updateById(string $table, string $column, string $id, array $data): ResponseInterface
    {
        if ($data === []) {
            throw new \InvalidArgumentException('Tidak ada data untuk diperbarui.');
        }
        $builder = db_connect()->table($table)->where($column, $id);
        if ($builder->countAllResults() === 0) {
            return $this->respond(['success' => false, 'message' => 'Data tidak ditemukan.'], 404);
        }
        db_connect()->table($table)->where($column, $id)->update($data);

        return $this->respond(['success' => true, 'message' => 'Data berhasil diperbarui.']);
    }

    /**
     * @param array<string, mixed> $data
     */
    private function only(array $data, array $fields): array
    {
        $result = array_intersect_key($data, array_flip($fields));
        foreach ($result as $key => $value) {
            if (is_string($value)) {
                $result[$key] = trim($value);
            }
        }

        return $result;
    }

    /**
     * @param array<string, mixed> $input
     */
    private function required(array $input, string $key): string
    {
        $value = trim((string) ($input[$key] ?? ''));
        if ($value === '') {
            throw new \InvalidArgumentException('Field ' . $key . ' wajib diisi.');
        }

        return $value;
    }

    /**
     * @param array<string, mixed> $input
     */
    private function value(array $input, string $key, string $default): string
    {
        return trim((string) ($input[$key] ?? $default));
    }

    /**
     * @param array<string, mixed> $input
     */
    private function number(array $input, string $key, ?float $default = null): float
    {
        $value = $input[$key] ?? $default;
        if (! is_numeric($value) || (float) $value < 0) {
            throw new \InvalidArgumentException('Field ' . $key . ' harus berupa angka nol atau lebih.');
        }

        return (float) $value;
    }

    private function itemWeight(array $item): float
    {
        $weight = $item['berat'] ?? null;
        if (! is_numeric($weight) || (float) $weight <= 0) {
            throw new \InvalidArgumentException('Berat setiap item harus lebih besar dari nol.');
        }

        return (float) $weight;
    }

    /**
     * @param array<string, mixed> $input
     * @return list<array<string, mixed>>
     */
    private function parseItems(array $input): array
    {
        $items = $input['items'] ?? null;
        if (! is_array($items) || $items === []) {
            throw new \InvalidArgumentException('Minimal satu item harus disertakan.');
        }

        foreach ($items as $item) {
            if (! is_array($item) || trim((string) ($item['kode'] ?? '')) === '') {
                throw new \InvalidArgumentException('Kode setiap item wajib diisi.');
            }
        }

        return array_values($items);
    }

    private function newId(string $prefix): string
    {
        return $prefix . '-' . date('YmdHis') . '-' . strtoupper(bin2hex(random_bytes(4)));
    }

    private function created(string $key, string $id): ResponseInterface
    {
        return $this->respond(['success' => true, 'message' => 'Data berhasil disimpan.', 'data' => [$key => $id]]);
    }

    private function insertKas($db, string $jenis, float $nominal, string $keterangan, string $referensi): void
    {
        $db->table('kas')->insert([
            'id_kas' => $this->newId('KAS'),
            'tanggal' => date('Y-m-d H:i:s'),
            'jenis' => $jenis,
            'nominal' => $nominal,
            'keterangan' => $keterangan,
            'referensi' => $referensi,
        ]);
    }

    private function commitOrFail($db): void
    {
        if ($db->transStatus() === false) {
            $db->transRollback();
            throw new DatabaseException('Transaksi database gagal.');
        }
        $db->transCommit();
    }

    /**
     * @param array<string, mixed> $body
     */
    private function respond(array $body, int $status = 200): ResponseInterface
    {
        return $this->response->setStatusCode($status)->setJSON($body);
    }
}
