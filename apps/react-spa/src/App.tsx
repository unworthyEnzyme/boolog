import { SWRConfig } from "swr";

function App() {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className="text-red-400 bg-slate-300 w-12 rounded-lg">
        hello world
      </div>
    </SWRConfig>
  );
}

export default App;
