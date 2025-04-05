import { useEffect, useState, useRef } from "react";
import { Seat } from "./Seat";
import { PassengerForm, PassengerData } from "./PassengerForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SEAT_PRICE = 1000;
const STORAGE_KEY = "reservationData";
const INACTIVITY_TIMEOUT = 30000;

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

  const inactivityTimerRef = useRef<number | null>(null);
  const warningShownRef = useRef<boolean>(false);
  const secondTimerRef = useRef<number | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current !== null) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (secondTimerRef.current !== null) {
      window.clearTimeout(secondTimerRef.current);
      secondTimerRef.current = null;
    }

    if (selectedSeats.length === 0) {
      warningShownRef.current = false;
      return;
    }

    inactivityTimerRef.current = window.setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        toast.warning(
          "İşleme devam etmek istiyor musunuz? 30 saniye içinde yanıt vermezseniz seçimleriniz sıfırlanacak.",
          {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
          }
        );

        startSecondTimer();
      }
    }, INACTIVITY_TIMEOUT);
  };

  const startSecondTimer = () => {
    if (secondTimerRef.current !== null) {
      window.clearTimeout(secondTimerRef.current);
      secondTimerRef.current = null;
    }

    secondTimerRef.current = window.setTimeout(() => {
      toast.error("Süre doldu! Seçimleriniz sıfırlanıyor.", {
        position: "top-center",
        autoClose: 3000,
      });
      clearSelections();
    }, INACTIVITY_TIMEOUT);
  };

  const clearSelections = () => {
    setSelectedSeats([]);
    setPassengers({});
    warningShownRef.current = false;

    if (inactivityTimerRef.current !== null) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (secondTimerRef.current !== null) {
      window.clearTimeout(secondTimerRef.current);
      secondTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handleUserActivity = () => {
      if (warningShownRef.current) {
        toast.dismiss();
        warningShownRef.current = false;
      }
      resetInactivityTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);

      if (inactivityTimerRef.current !== null) {
        window.clearTimeout(inactivityTimerRef.current);
      }

      if (secondTimerRef.current !== null) {
        window.clearTimeout(secondTimerRef.current);
      }
    };
  }, [selectedSeats]);

  useEffect(() => {
    resetInactivityTimer();
  }, [selectedSeats]);

  useEffect(() => {
    if (warningShownRef.current) {
      startSecondTimer();
    }
  }, [warningShownRef.current]);

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
      toast.error("Bu koltuk dolu!");
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
      const newPassengers = { ...passengers };
      delete newPassengers[seatNumber];
      setPassengers(newPassengers);
    } else {
      if (selectedSeats.length >= 3) {
        toast.warning("En fazla 3 koltuk seçebilirsiniz!");
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
      toast.error("Lütfen en az bir koltuk seçin!");
      return;
    }

    if (!isAllPassengersComplete()) {
      toast.error("Lütfen tüm yolcu bilgilerini eksiksiz doldurun!");
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

    toast.success("Rezervasyon başarıyla tamamlandı!");
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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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
    </>
  );
};
