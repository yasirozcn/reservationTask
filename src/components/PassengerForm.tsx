import { useState, useEffect } from "react";

interface PassengerFormProps {
  seatNumber: number;
  onClose: () => void;
  onSubmit: (data: PassengerData) => void;
  validate: boolean;
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
  validate,
}: PassengerFormProps) => {
  const [formData, setFormData] = useState<PassengerData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "İsim alanı zorunludur";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "İsim alanında sayı bulunamaz";
    }

    if (!formData.surname) {
      newErrors.surname = "Soyisim alanı zorunludur";
    } else if (/\d/.test(formData.surname)) {
      newErrors.surname = "Soyisim alanında sayı bulunamaz";
    }

    if (!formData.email) {
      newErrors.email = "E-posta alanı zorunludur";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        "Geçerli bir e-posta adresi giriniz (örn: ornek@mail.com)";
    }

    if (!formData.phone) {
      newErrors.phone = "Telefon alanı zorunludur";
    }

    if (!formData.gender) {
      newErrors.gender = "Cinsiyet alanı zorunludur";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Doğum tarihi alanı zorunludur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onSubmit(updatedFormData);
  };

  useEffect(() => {
    if (validate) {
      validateForm();
    }
  }, [validate, formData]);

  return (
    <div className="bg-gray-200 p-4 rounded-lg mb-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{seatNumber}. Yolcu</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          X
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.surname ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.surname && (
            <p className="text-red-500 text-xs mt-1">{errors.surname}</p>
          )}
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cinsiyet
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.birthDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};
