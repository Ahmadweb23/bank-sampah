import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDashboardData, loginOperator, loginWarga, submitSetoran } from './api'

describe('api service', () => {
  beforeEach(() => {  
    vi.stubGlobal('fetch', vi.fn())
  })

  it('mengirimkan request dashboard dengan method GET', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: { total_warga: 12 } })
    })

    const result = await getDashboardData()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('action=dashboard'),
      expect.objectContaining({ method: 'GET' })
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
      items: [{ kode: 'PLS', berat: 3.5 }]
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST'
      })
    )

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(options.body).toContain('simpan_setoran')
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
      text: async () => JSON.stringify({ success: true, data: { nama: 'Budi' } })
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
  })
})
