import { AuthProvider } from './_providers/Auth'

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}