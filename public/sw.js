self.addEventListener("install", (event) => {
    console.log("✅ Service Worker instalado");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    console.log("✅ Service Worker activado");
  });
  
  self.addEventListener("fetch", (event) => {
    console.log("🔍 Fetch interceptado:", event.request.url);
  });
  