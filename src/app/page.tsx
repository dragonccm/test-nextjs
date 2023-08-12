import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action="/reregister" className="flex flex-col items-center justify-between">
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <button>register</button>
      </form>
    </main>
  )
}
