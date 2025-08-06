
import Header from './_components/Header'
import Footer from './_components/Footer'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
