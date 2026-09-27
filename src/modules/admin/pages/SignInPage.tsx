import { SignIn } from '@clerk/clerk-react'

/**
 * IMPORTANTE: rol único (solo Rebeca + Joshua). signUpUrl={undefined}
 * solo oculta el link "¿No tienes cuenta?" en este componente — NO
 * deshabilita el registro público en Clerk. Eso se hace desde el
 * dashboard de Clerk (User & Authentication → Restrictions →
 * deshabilitar "Public sign-up" o similar) para que sea real y no
 * solo cosmético. Pendiente de hacer ahí cuando existan las
 * credenciales reales del proyecto.
 */
export function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 p-6">
      <div>
        <p className="mb-6 text-center font-[var(--font-serif-brand)] text-3xl text-cream-50">
          RV
        </p>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl={undefined}
          fallbackRedirectUrl="/admin"
        />
      </div>
    </div>
  )
}
