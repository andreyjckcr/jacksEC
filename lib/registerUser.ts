export async function registerUser(
    employeeCode: string,
    name: string,
    email: string,
    cedula: string,
    phone: string,
    address?: string
  ) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo_empleado: employeeCode,
          nombre: name,
          correo: email,
          cedula,
          telefono: phone,
          direccion: address,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }
  
      return { success: true, message: "Usuario registrado correctamente" };
    } catch (error: any) {
      console.error("❌ Error en registro:", error.message);
      return { success: false, error: error.message };
    }
  }  
  