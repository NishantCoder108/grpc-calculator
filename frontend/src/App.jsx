import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { CalculatorClient } from "./generated/calculator.client.ts";

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);

  let transport = new GrpcWebFetchTransport({
    baseUrl: "http://[::1]:50051",
  });

  const client = new CalculatorClient(transport);

  const handleAdd = () => {
    client.add({ a: num1, b: num2 }).then((response) => {
      console.log(response.response.result);
      setResult(parseInt(response.response.result));
    });
  };

  const handleMultiply = () => {
    client.multiply({ a: num1, b: num2 }).then((response) => {
      setResult(parseInt(response.response.result));
    });
  };

  const handleSub = () => {
    client
      .subtract({ a: num1, b: num2 })
      .then((res) => setResult(res.response.result));
  };

  const handleDivide = async () => {
    try {
      const res = await client.divide({ a: num1, b: num2 });
      console.log(res.response.result);
      setResult(res.response.result);
    } catch (err) {
      console.error("Division failed:", err);
      // setResult(err.message || "Error");

      const rawMessage = err.message || "Unknown Error";
      const cleanMessage = decodeURIComponent(rawMessage);

      console.error("Decoded Error:", cleanMessage);
      setResult(cleanMessage);
    }
  };

  return (
    <>
      <h1 className="text-6xl font-extrabold background bg-gradient-to-r from-red-300 to-blue-300 text-transparent bg-clip-text py-2">
        gRPCalculator
      </h1>
      <div className="">
        <div className="px-4 py-5 sm:p flex flex-col space-y-4">
          <input
            type="number"
            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-3xl sm:leading-6 text-center"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="Enter first number"
          />
          <input
            type="number"
            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-3xl sm:leading-6 text-center"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Enter second number"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded bg-indigo-500 px-2 py-2 text-3xl font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Add
          </button>

          <button
            type="button"
            onClick={handleMultiply}
            className="rounded bg-indigo-500 px-2 py-2 text-3xl font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Multiply
          </button>

          <button
            type="button"
            onClick={handleSub}
            className="rounded bg-indigo-500 px-2 py-2 text-3xl font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Subtract
          </button>

          <button
            type="button"
            onClick={handleDivide}
            className="rounded bg-indigo-500 px-2 py-2 text-3xl font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Divide
          </button>
        </div>
      </div>
      <div className="">
        <h2 class="text-4xl font-bold">Result: {result}</h2>
      </div>
    </>
  );
}

export default App;
