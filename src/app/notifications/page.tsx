"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";

export default function NotificationSettings() {
  const router = useRouter();
  const [savedSettings, setSavedSettings] = useState<{
    pushEnabled: boolean;
    phoneNumber: string;
    emailEnabled: boolean;
    emailAddress: string;
  } | null>(null);
  const [settings, setSettings] = useState({
    pushEnabled: false,
    phoneNumber: "",
    emailEnabled: false,
    emailAddress: "",
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // ✅ Obtener configuración del usuario
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) throw new Error("Error al obtener la configuración");
        const data = await response.json();

        setSettings({
          pushEnabled: data.pushEnabled,
          phoneNumber: data.telefono || "",
          emailEnabled: data.emailEnabled,
          emailAddress: data.email || "",
        });

        setSavedSettings(data);
      } catch (error) {
        console.error("❌ Error obteniendo configuración:", error);
      }
    }
    fetchSettings();
  }, []);

  // ✅ Verifica si hay cambios sin guardar
  useEffect(() => {
    if (savedSettings) {
      setUnsavedChanges(JSON.stringify(settings) !== JSON.stringify(savedSettings));
    }
  }, [settings, savedSettings]);

  // ✅ Manejar cambios en los inputs
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Guardar cambios en la BD
  const handleSave = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Error al guardar configuración");

      toast.success("Configuración guardada correctamente");
      setSavedSettings(settings);
      setUnsavedChanges(false);
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  // ✅ Manejar regreso con confirmación
  const handleGoBack = () => {
    if (unsavedChanges) {
      setShowConfirmPopup(true);
    } else {
      router.back();
    }
  };

  // ✅ Confirmar regreso sin guardar
  const confirmGoBack = () => {
    setShowConfirmPopup(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Configuración de Notificaciones</h1>

        {/* 🔹 Notificaciones Obligatorias */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Notificaciones obligatorias</h2>
          <h3>Las siguientes notificaciones son obligatorias:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Confirmación de compra</li>
            <li>Pedido recibido en planta de alimentos</li>
            <li>Pedido listo para entrega o recogida</li>
          </ul>
        </section>

        {/* 🔹 Notificaciones Push */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Notificaciones Push</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" name="pushEnabled" checked={settings.pushEnabled} onChange={handleChange} className="h-5 w-5" />
            <span className="text-gray-700">Habilitar notificaciones push</span>
          </label>

          {settings.pushEnabled && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Número de teléfono:</label>
              <input
                type="text"
                name="phoneNumber"
                value={settings.phoneNumber}
                onChange={handleChange}
                placeholder="Ingrese su número"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}
        </section>

        {/* 🔹 Notificaciones por Email */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Notificaciones por Correo</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" name="emailEnabled" checked={settings.emailEnabled} onChange={handleChange} className="h-5 w-5" />
            <span className="text-gray-700">Habilitar notificaciones por email</span>
          </label>

          {settings.emailEnabled && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Correo Electrónico:</label>
              <input
                type="email"
                name="emailAddress"
                value={settings.emailAddress}
                onChange={handleChange}
                placeholder="Ingrese su correo"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}
        </section>

        {/* 🔹 Botones */}
        <div className="flex justify-between">
          <Button onClick={handleGoBack} className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md transition-all">
            Regresar
          </Button>

          <Button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all hover:bg-blue-700" disabled={!unsavedChanges}>
            Guardar Cambios
          </Button>
        </div>
      </main>

      {/* 🔥 PopUp de confirmación para regresar sin guardar */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-red-600">¿Regresar sin guardar?</h3>
            <p className="text-gray-600">Tus cambios no se guardarán si sales.</p>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowConfirmPopup(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmGoBack} className="bg-red-500 hover:bg-red-600 text-white">
                Regresar sin guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

