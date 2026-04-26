import { useMemo, useState } from "react";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { CalculatorClient } from "./generated/calculator.client.ts";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("0");

  const client = useMemo(() => {
    const transport = new GrpcWebFetchTransport({
      baseUrl: "http://[::1]:50051",
    });
    return new CalculatorClient(transport);
  }, []);

  const parseInputs = () => ({
    a: Number(num1 || 0),
    b: Number(num2 || 0),
  });

  const handleOperation = async (operation) => {
    try {
      const payload = parseInputs();
      const response = await client[operation](payload);
      setResult(String(response.response.result));
    } catch (err) {
      const rawMessage = err?.message || "Operation failed";
      setResult(decodeURIComponent(rawMessage));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-8 text-center">
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl text-indigo-600">
            gRPC Calculator
          </h1>
        </header>

        <div className="space-y-4">
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="First number"
          />
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Second number"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOperation("add")}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-500"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => handleOperation("subtract")}
            className="rounded-xl bg-slate-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-700"
          >
            Subtract
          </button>
          <button
            type="button"
            onClick={() => handleOperation("multiply")}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-500"
          >
            Multiply
          </button>
          <button
            type="button"
            onClick={() => handleOperation("divide")}
            className="rounded-xl bg-rose-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-rose-500"
          >
            Divide
          </button>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
          <p className="text-sm text-slate-500">Result</p>
          <p className="mt-1 wrap-break-word text-3xl font-bold text-slate-900">
            {result}
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;
