import { PassengerData } from "./PassengerForm";

interface SeatProps {
  number: number;
  isSelected: boolean;
  isOccupied: boolean;
  occupiedBy?: PassengerData;
  onSelect: (seatNumber: number) => void;
}

export const Seat = ({
  number,
  isSelected,
  isOccupied,
  occupiedBy,
  onSelect,
}: SeatProps) => {
  const getBackgroundColor = () => {
    if (isOccupied) return "bg-gray-500";
    if (isSelected) return "bg-yellow-500";
    return "bg-white";
  };

  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(number)}
        className={`w-12 h-12 ${getBackgroundColor()} border border-gray-300 rounded flex items-center justify-center transition-colors ${
          !isOccupied && "hover:bg-blue-100"
        }`}
      >
        {number}
      </button>
      {isOccupied && occupiedBy && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {occupiedBy.name} {occupiedBy.surname}
        </div>
      )}
    </div>
  );
};
