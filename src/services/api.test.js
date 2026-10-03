import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getApiBaseUrl, getDashboardData, loginOperator, loginWarga, logoutApi, submitSetoran } from './api'

describe('api service', () => {
  let token
  let localStorage

  beforeEach(() => {  
    vi.stubGlobal('fetch', vi.fn())
    token = null
    localStorage = {
      getItem: vi.fn(() => token),
      setItem: vi.fn((key, value) => {
        if (key === 'api_token') token = value
      }),
      removeItem: vi.fn((key) => {
        if (key === 'api_token') token = null
      })
    }
    vi.stubGlobal('window', { localStorage })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('menggunakan URL Apps Script dari konfigurasi Vite', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://example.test/macros/s/test/exec')

    expect(getApiBaseUrl()).toBe('https://example.test/macros/s/test/exec')
  })

  it('mengirimkan request dashboard dengan method GET', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: { total_warga: 12 } })
    })

    const result = await getDashboardData()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('action=dashboard'),
      expect.objectContaining({ method: 'GET', credentials: 'omit' })
    )
    expect(result.data.total_warga).toBe(12)
  })

  it('mengirimkan payload setoran lewat method POST', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: { id_setoran: 'STR-1' } })
    })

    const result = await submitSetoran({
      username: 'budi',
      items: [{ kode: 'PLS', berat: 3.5 }],
      metode_pembayaran: 'TUNAI'
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        credentials: 'omit'
      })
    )

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(options.body).toContain('simpan_setoran')
    expect(JSON.parse(options.body).metode_pembayaran).toBe('TUNAI')
    expect(options.headers['Content-Type']).toBe('text/plain;charset=UTF-8')
    expect(result.data.id_setoran).toBe('STR-1')
  })

  it('mengirimkan username dan password untuk login operator lewat POST', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: { nama: 'Sari' } })
    })

    const result = await loginOperator({ username: 'sari', password: 'rahasia123' })

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    )

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(options.body).toContain('login_operator')
    expect(options.body).toContain('sari')
    expect(options.body).toContain('rahasia123')
    expect(result.data.nama).toBe('Sari')
  })

  it('mengirimkan username dan nomor HP untuk login warga lewat POST', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: { nama: 'Budi', token: 'session-warga' } })
    })

    const result = await loginWarga({ username: 'budi', no_hp: '08123456789' })

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    )

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(options.body).toContain('login_warga')
    expect(options.body).toContain('08123456789')
    expect(result.data.nama).toBe('Budi')
    expect(localStorage.setItem).toHaveBeenCalledWith('api_token', 'session-warga')
  })

  it('mengakhiri sesi backend lewat POST', async () => {
    token = 'session-operator'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true })
    })

    await logoutApi()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('action=logout'),
      expect.objectContaining({ method: 'POST', credentials: 'omit' })
    )
    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(JSON.parse(options.body).token).toBe('session-operator')
    expect(localStorage.removeItem).toHaveBeenCalledWith('api_token')
  })

  it('mengirimkan token Apps Script pada request GET yang terlindungi', async () => {
    token = 'session-operator'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: [] })
    })

    await getDashboardData()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('token=session-operator'),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('mengubah response gagal Apps Script menjadi error yang terlihat', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: false, message: 'Akses ditolak.' })
    })

    await expect(getDashboardData()).rejects.toThrow('Akses ditolak.')
  })
})
