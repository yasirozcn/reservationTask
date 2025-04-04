import { SeatMap } from "./components/SeatMap";

function App() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Uçak Rezervasyon Sistemi
        </h1>
        <SeatMap />
      </div>
    </div>
  );
}

export default App;
