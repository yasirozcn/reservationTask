import { useEffect, useState } from "react";
import { Seat } from "./Seat";
import { PassengerForm, PassengerData } from "./PassengerForm";

const SEAT_PRICE = 1000;
const STORAGE_KEY = "reservationData";

interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface StorageData {
  selectedSeats: number[];
  passengers: Record<number, PassengerData>;
  occupiedSeats: Record<number, PassengerData>;
}

export const SeatMap = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengers, setPassengers] = useState<Record<number, PassengerData>>(
    {}
  );
  const [occupiedSeats, setOccupiedSeats] = useState<
    Record<number, PassengerData>
  >({});

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      console.log("localStorage'dan okunan ham veri:", storedData);

      if (storedData) {
        const parsedData = JSON.parse(storedData) as StorageData;
        setSelectedSeats(parsedData.selectedSeats || []);
        setPassengers(parsedData.passengers || {});
        setOccupiedSeats(parsedData.occupiedSeats || {});

        if (Object.keys(parsedData.occupiedSeats || {}).length < 10) {
          fetchApiData();
        }
      } else {
        fetchApiData();
      }
    } catch (error) {
      console.error("Local storage yükleme hatası:", error);
      fetchApiData();
    }
  }, []);

  const fetchApiData = () => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data: ApiUser[]) => {
        const apiSeats: Record<number, PassengerData> = {};
        data.forEach((user) => {
          const passengerData: PassengerData = {
            name: user.name.split(" ")[0],
            surname: user.name.split(" ")[1] || "",
            email: user.email,
            phone: user.phone,
            gender: "male",
            birthDate: "1990-01-01",
          };
          apiSeats[user.id] = passengerData;
        });

        setOccupiedSeats(apiSeats);
        const dataToStore: StorageData = {
          selectedSeats: [],
          passengers: {},
          occupiedSeats: apiSeats,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      })
      .catch((error) => {
        console.error("API verisi çekme hatası:", error);
      });
  };

  useEffect(() => {
    if (Object.keys(occupiedSeats).length === 0) return;
    try {
      console.log("Mevcut occupiedSeats:", occupiedSeats);

      const dataToStore: StorageData = {
        selectedSeats,
        passengers,
        occupiedSeats,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Local storage kaydetme hatası:", error);
    }
  }, [selectedSeats, passengers, occupiedSeats]);

  const handleSeatSelect = (seatNumber: number) => {
    if (occupiedSeats[seatNumber]) {
      alert("Bu koltuk dolu!");
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
      const newPassengers = { ...passengers };
      delete newPassengers[seatNumber];
      setPassengers(newPassengers);
    } else {
      if (selectedSeats.length >= 3) {
        alert("En fazla 3 koltuk seçebilirsiniz!");
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handlePassengerSubmit = (seatNumber: number, data: PassengerData) => {
    setPassengers((prev) => ({ ...prev, [seatNumber]: data }));
  };

  const isAllPassengersComplete = () => {
    return selectedSeats.every((seatNumber) => {
      const passenger = passengers[seatNumber];
      return (
        passenger && Object.values(passenger).every((value) => value !== "")
      );
    });
  };

  const handleComplete = () => {
    if (selectedSeats.length === 0) {
      alert("Lütfen en az bir koltuk seçin!");
      return;
    }

    if (!isAllPassengersComplete()) {
      alert("Lütfen tüm yolcu bilgilerini eksiksiz doldurun!");
      return;
    }

    const newOccupiedSeats = { ...occupiedSeats, ...passengers };
    console.log(
      "Rezervasyon tamamlandı, yeni occupiedSeats:",
      newOccupiedSeats
    );
    setOccupiedSeats(newOccupiedSeats);

    try {
      const dataToStore: StorageData = {
        selectedSeats: [],
        passengers: {},
        occupiedSeats: newOccupiedSeats,
      };

      console.log(
        "Rezervasyon sonrası localStorage'a kaydedilecek veriler:",
        dataToStore
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Rezervasyon kaydetme hatası:", error);
    }

    setSelectedSeats([]);
    setPassengers({});

    alert("Rezervasyon başarıyla tamamlandı!");
  };

  const renderSeats = () => {
    const seats = [];
    const totalSeats = 76;
    const seatsPerRow = 4;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);

    for (let row = 0; row < totalRows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = row * seatsPerRow + col + 1;
        if (seatNumber <= totalSeats) {
          rowSeats.push(
            <div key={seatNumber} className="w-16">
              <Seat
                number={seatNumber}
                isSelected={selectedSeats.includes(seatNumber)}
                isOccupied={Boolean(occupiedSeats[seatNumber])}
                occupiedBy={occupiedSeats[seatNumber]}
                onSelect={handleSeatSelect}
              />
            </div>
          );
        }
      }
      seats.push(
        <div key={`row-${row}`} className="flex gap-2 mb-2">
          {rowSeats}
        </div>
      );
    }

    return seats;
  };

  const renderPriceInfo = () => {
    if (selectedSeats.length === 0) return null;

    const totalPrice = selectedSeats.length * SEAT_PRICE;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {selectedSeats.map((seat) => (
              <div key={seat} className="bg-yellow-100 px-2 py-1 rounded">
                {seat}
              </div>
            ))}
          </div>
          <div className="text-lg font-semibold">{selectedSeats.length}x</div>
        </div>
        <div className="text-2xl font-bold mt-1">
          {totalPrice.toLocaleString("tr-TR")} TL
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gray-100 -z-10 rounded-t-[120px]" />
        <div className="flex flex-col items-center p-8 pt-16">
          {renderSeats()}
        </div>
        <div className="flex justify-center gap-4 mt-4 pb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded mr-2" />
            <span>Dolu</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
            <span>Seçili</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2" />
            <span>Boş</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedSeats.map((seatNumber) => (
          <PassengerForm
            key={seatNumber}
            seatNumber={seatNumber}
            onClose={() => handleSeatSelect(seatNumber)}
            onSubmit={(data) => handlePassengerSubmit(seatNumber, data)}
          />
        ))}
        {selectedSeats.length > 0 && (
          <>
            <button
              onClick={handleComplete}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              İşlemleri Tamamla ({selectedSeats.length} Yolcu)
            </button>
            {renderPriceInfo()}
          </>
        )}
      </div>
    </div>
  );
};
