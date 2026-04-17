export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-black text-white'>
      <h1 className='text-4xl font-bold mb-4'>VermiAI</h1>

      <p className='text-lg text-gray-400 mb-6 text-center max-w-md'>
        AI decision assistant for optimizing digital income strategies.
      </p>

      <a
        href='/dashboard'
        className='bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition'
      >
        Go to Dashboard
      </a>
    </main>
  )
}
