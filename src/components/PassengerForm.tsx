import { useState } from "react";

interface PassengerFormProps {
  seatNumber: number;
  onClose: () => void;
  onSubmit: (data: PassengerData) => void;
}

export interface PassengerData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
}

export const PassengerForm = ({
  seatNumber,
  onClose,
  onSubmit,
}: PassengerFormProps) => {
  const [formData, setFormData] = useState<PassengerData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    onSubmit(newFormData);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg mb-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{seatNumber}. Yolcu</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          ▼
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            İsim
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Soyisim
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-Posta
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cinsiyet
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Doğum Tarihi
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
