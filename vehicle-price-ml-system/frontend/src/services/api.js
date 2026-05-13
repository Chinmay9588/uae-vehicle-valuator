const API_URL = "http://127.0.0.1:5000";

export const getOptions = async () => {
  const res = await fetch(`${API_URL}/get_options`);
  return res.json();
};

export const getBrands = async () => {
  try {
    const res = await fetch(`${API_URL}/get-brands`);
    if (!res.ok) throw new Error("Failed to fetch brands");
    return await res.json();
  } catch (err) {
    console.error("API getBrands error:", err);
    return [];
  }
};

export const getModels = async (brand) => {
  if (!brand) return [];
  try {
    const res = await fetch(`${API_URL}/get-models/${encodeURIComponent(brand)}`);
    if (!res.ok) throw new Error("Failed to fetch models");
    return await res.json();
  } catch (err) {
    console.error("API getModels error:", err);
    return [];
  }
};

export const predictPrice = async (formData) => {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${formData.make} ${formData.model}`,
      year: parseInt(formData.year),
      km_driven: parseInt(formData.mileage),
      fuel: formData.fuelType,
      transmission: formData.transmission,
      owner: formData.owners,
      present_price: parseFloat(formData.presentPrice)
    })
  });
  return res.json();
};
