import MessageSection from "./_components/MessageSection"
import { getPayloadMesseges } from "@cms/_hooks/message/getPayloadMesseges"

export default async function Page() {
 const messages = await getPayloadMesseges()
  return (
    <MessageSection messages={messages}/>
  )
}