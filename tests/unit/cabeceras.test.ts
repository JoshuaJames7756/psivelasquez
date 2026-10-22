import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const valor = (source: string, key: string) =>
  config.headers.find((h) => h.source === source)?.headers.find((h) => h.key === key)?.value

describe('cabeceras de seguridad (vercel.json)', () => {
  const csp = valor('/((?!admin|sign-in).*)', 'Content-Security-Policy') ?? ''

  it('el sitio público tiene CSP estricta: scripts solo propios, sin unsafe-inline ni eval', () => {
    expect(csp).toContain("script-src 'self';")
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/)
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'self'")
  })

  it('el sitio público no habla con Clerk (no lo carga)', () => {
    expect(csp).not.toContain('clerk')
  })

  it('el panel y el login permiten solo los orígenes de Clerk y Cloudinary que necesitan', () => {
    for (const fuente of ['/admin(.*)', '/sign-in(.*)']) {
      const panel = valor(fuente, 'Content-Security-Policy-Report-Only') ?? ''
      expect(panel).toContain('https://*.clerk.accounts.dev')
      expect(panel).toContain('https://api.cloudinary.com')
      expect(panel).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/)
    }
  })
})
