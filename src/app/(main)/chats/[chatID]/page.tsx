export default function Page({ params }: { params: { chatID: string } }) {
  return <div>Chat ID: {params.chatID}</div>;
}
