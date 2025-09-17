import CurrentDate from "./components/CurrentDate"
import TimeDiary from "./components/TimeDiary"

const App = () => {
  return (
    <main className="px-6 py-6">
      <div className="flex flex-col gap-8">
        <div>
          <CurrentDate />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Hello, Shaheer!</h1>
          <p>Track your time diary for today</p>
        </div>

        <div>
          <TimeDiary />
        </div>
      </div>
    </main>
  )
}

export default App
