import ToastMessage from "@/app/(frontend)/(auth)/_components/ToastMessage";

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <ToastMessage />
      {children}
    </>
  )
}