"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/profile/route";
exports.ids = ["app/api/profile/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_icortez_Desktop_Jacks_Ecommerce_src_app_api_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/profile/route.ts */ \"(rsc)/./src/app/api/profile/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/profile/route\",\n        pathname: \"/api/profile\",\n        filename: \"route\",\n        bundlePath: \"app/api/profile/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\icortez\\\\Desktop\\\\Jacks Ecommerce\\\\src\\\\app\\\\api\\\\profile\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_icortez_Desktop_Jacks_Ecommerce_src_app_api_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/profile/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwcm9maWxlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwcm9maWxlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcHJvZmlsZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNpY29ydGV6JTVDRGVza3RvcCU1Q0phY2tzJTIwRWNvbW1lcmNlJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNpY29ydGV6JTVDRGVza3RvcCU1Q0phY2tzJTIwRWNvbW1lcmNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUM4QjtBQUMzRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL215LXYwLXByb2plY3QvPzI5M2YiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcaWNvcnRlelxcXFxEZXNrdG9wXFxcXEphY2tzIEVjb21tZXJjZVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxwcm9maWxlXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9wcm9maWxlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcHJvZmlsZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcHJvZmlsZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGljb3J0ZXpcXFxcRGVza3RvcFxcXFxKYWNrcyBFY29tbWVyY2VcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccHJvZmlsZVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvcHJvZmlsZS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Correo Electr\\xf3nico\",\n                    type: \"email\"\n                },\n                codigo_empleado: {\n                    label: \"C\\xf3digo de Empleado\",\n                    type: \"text\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials) {\n                    throw new Error(\"Missing credentials\");\n                }\n                const { email, codigo_empleado } = credentials;\n                // **Verificar si el usuario existe en la BD**\n                const user = await prisma.usuarios_ecommerce.findUnique({\n                    where: {\n                        codigo_empleado\n                    }\n                });\n                // **Si no existe, retornar null**\n                if (!user) {\n                    console.log(\"❌ Usuario no encontrado\");\n                    return null;\n                }\n                // **Verificar si el usuario está activo**\n                if (user.estado !== \"Activo\") {\n                    console.log(\"❌ Usuario inactivo\");\n                    return null;\n                }\n                // **Comparar emails sin importar mayúsculas/minúsculas**\n                if (user.correo.toLowerCase() !== email.toLowerCase()) {\n                    console.log(\"❌ Email incorrecto\");\n                    return null;\n                }\n                console.log(\"✅ Usuario autenticado:\", user.nombre);\n                return {\n                    id: user.id.toString(),\n                    codigo_empleado: user.codigo_empleado,\n                    name: user.nombre,\n                    email: user.correo\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async session ({ session, token }) {\n            session.user.id = token.id;\n            return session;\n        },\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n            }\n            return token;\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBZ0M7QUFDaUM7QUFDcEI7QUFFN0MsTUFBTUcsU0FBUyxJQUFJRCx3REFBWUE7QUFFeEIsTUFBTUUsY0FBYztJQUN6QkMsV0FBVztRQUNUSiwyRUFBbUJBLENBQUM7WUFDbEJLLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBc0JDLE1BQU07Z0JBQVE7Z0JBQ3BEQyxpQkFBaUI7b0JBQUVGLE9BQU87b0JBQXNCQyxNQUFNO2dCQUFPO1lBQy9EO1lBQ0EsTUFBTUUsV0FBVUwsV0FBVztnQkFDekIsSUFBSSxDQUFDQSxhQUFhO29CQUNoQixNQUFNLElBQUlNLE1BQU07Z0JBQ2xCO2dCQUNBLE1BQU0sRUFBRUwsS0FBSyxFQUFFRyxlQUFlLEVBQUUsR0FBR0o7Z0JBR25DLDhDQUE4QztnQkFDOUMsTUFBTU8sT0FBTyxNQUFNWCxPQUFPWSxrQkFBa0IsQ0FBQ0MsVUFBVSxDQUFDO29CQUN0REMsT0FBTzt3QkFBRU47b0JBQWdCO2dCQUMzQjtnQkFHQSxrQ0FBa0M7Z0JBQ2xDLElBQUksQ0FBQ0csTUFBTTtvQkFDVEksUUFBUUMsR0FBRyxDQUFDO29CQUNaLE9BQU87Z0JBQ1Q7Z0JBRUEsMENBQTBDO2dCQUMxQyxJQUFJTCxLQUFLTSxNQUFNLEtBQUssVUFBVTtvQkFDNUJGLFFBQVFDLEdBQUcsQ0FBQztvQkFDWixPQUFPO2dCQUNUO2dCQUVBLHlEQUF5RDtnQkFDekQsSUFBSUwsS0FBS08sTUFBTSxDQUFDQyxXQUFXLE9BQU9kLE1BQU1jLFdBQVcsSUFBSTtvQkFDckRKLFFBQVFDLEdBQUcsQ0FBQztvQkFDWixPQUFPO2dCQUNUO2dCQUVBRCxRQUFRQyxHQUFHLENBQUMsMEJBQTBCTCxLQUFLUyxNQUFNO2dCQUNqRCxPQUFPO29CQUNMQyxJQUFJVixLQUFLVSxFQUFFLENBQUNDLFFBQVE7b0JBQ3BCZCxpQkFBaUJHLEtBQUtILGVBQWU7b0JBQ3JDTCxNQUFNUSxLQUFLUyxNQUFNO29CQUNqQmYsT0FBT00sS0FBS08sTUFBTTtnQkFDcEI7WUFDRjtRQUNGO0tBQ0Q7SUFDREssV0FBVztRQUNULE1BQU1DLFNBQVEsRUFBRUEsT0FBTyxFQUFFQyxLQUFLLEVBQWdDO1lBQzVERCxRQUFRYixJQUFJLENBQUNVLEVBQUUsR0FBR0ksTUFBTUosRUFBRTtZQUMxQixPQUFPRztRQUNUO1FBQ0EsTUFBTUUsS0FBSSxFQUFFRCxLQUFLLEVBQUVkLElBQUksRUFBNkI7WUFDbEQsSUFBSUEsTUFBTTtnQkFDUmMsTUFBTUosRUFBRSxHQUFHVixLQUFLVSxFQUFFO1lBQ3BCO1lBQ0EsT0FBT0k7UUFDVDtJQUNGO0lBQ0FFLE9BQU87UUFDTEMsUUFBUTtJQUNWO0lBQ0FDLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtBQUNyQyxFQUFDO0FBRUQsTUFBTUMsVUFBVXBDLGdEQUFRQSxDQUFDSTtBQUNpQiIsInNvdXJjZXMiOlsid2VicGFjazovL215LXYwLXByb2plY3QvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHM/MDA5OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiXHJcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzXCJcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCJcclxuXHJcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKVxyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zID0ge1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XHJcbiAgICAgIG5hbWU6IFwiQ3JlZGVudGlhbHNcIixcclxuICAgICAgY3JlZGVudGlhbHM6IHtcclxuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJDb3JyZW8gRWxlY3Ryw7NuaWNvXCIsIHR5cGU6IFwiZW1haWxcIiB9LFxyXG4gICAgICAgIGNvZGlnb19lbXBsZWFkbzogeyBsYWJlbDogXCJDw7NkaWdvIGRlIEVtcGxlYWRvXCIsIHR5cGU6IFwidGV4dFwiIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xyXG4gICAgICAgIGlmICghY3JlZGVudGlhbHMpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgY3JlZGVudGlhbHNcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgY29kaWdvX2VtcGxlYWRvIH0gPSBjcmVkZW50aWFsc1xyXG5cclxuXHJcbiAgICAgICAgLy8gKipWZXJpZmljYXIgc2kgZWwgdXN1YXJpbyBleGlzdGUgZW4gbGEgQkQqKlxyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXN1YXJpb3NfZWNvbW1lcmNlLmZpbmRVbmlxdWUoe1xyXG4gICAgICAgICAgd2hlcmU6IHsgY29kaWdvX2VtcGxlYWRvIH0sXHJcbiAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIC8vICoqU2kgbm8gZXhpc3RlLCByZXRvcm5hciBudWxsKipcclxuICAgICAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwi4p2MIFVzdWFyaW8gbm8gZW5jb250cmFkb1wiKVxyXG4gICAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICoqVmVyaWZpY2FyIHNpIGVsIHVzdWFyaW8gZXN0w6EgYWN0aXZvKipcclxuICAgICAgICBpZiAodXNlci5lc3RhZG8gIT09IFwiQWN0aXZvXCIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwi4p2MIFVzdWFyaW8gaW5hY3Rpdm9cIilcclxuICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAqKkNvbXBhcmFyIGVtYWlscyBzaW4gaW1wb3J0YXIgbWF5w7pzY3VsYXMvbWluw7pzY3VsYXMqKlxyXG4gICAgICAgIGlmICh1c2VyLmNvcnJlby50b0xvd2VyQ2FzZSgpICE9PSBlbWFpbC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuKdjCBFbWFpbCBpbmNvcnJlY3RvXCIpXHJcbiAgICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLinIUgVXN1YXJpbyBhdXRlbnRpY2FkbzpcIiwgdXNlci5ub21icmUpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlkOiB1c2VyLmlkLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICBjb2RpZ29fZW1wbGVhZG86IHVzZXIuY29kaWdvX2VtcGxlYWRvLFxyXG4gICAgICAgICAgbmFtZTogdXNlci5ub21icmUsXHJcbiAgICAgICAgICBlbWFpbDogdXNlci5jb3JyZW8sXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBjYWxsYmFja3M6IHtcclxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9OiB7IHNlc3Npb246IGFueSwgdG9rZW46IGFueSB9KSB7XHJcbiAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLmlkXHJcbiAgICAgIHJldHVybiBzZXNzaW9uXHJcbiAgICB9LFxyXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfTogeyB0b2tlbjogYW55LCB1c2VyOiBhbnkgfSkge1xyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0b2tlblxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBhZ2VzOiB7XHJcbiAgICBzaWduSW46IFwiL2xvZ2luXCIsXHJcbiAgfSxcclxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcclxufVxyXG5cclxuY29uc3QgaGFuZGxlciA9IE5leHRBdXRoKGF1dGhPcHRpb25zKVxyXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH1cclxuIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsIlByaXNtYUNsaWVudCIsInByaXNtYSIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJjb2RpZ29fZW1wbGVhZG8iLCJhdXRob3JpemUiLCJFcnJvciIsInVzZXIiLCJ1c3Vhcmlvc19lY29tbWVyY2UiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJjb25zb2xlIiwibG9nIiwiZXN0YWRvIiwiY29ycmVvIiwidG9Mb3dlckNhc2UiLCJub21icmUiLCJpZCIsInRvU3RyaW5nIiwiY2FsbGJhY2tzIiwic2Vzc2lvbiIsInRva2VuIiwiand0IiwicGFnZXMiLCJzaWduSW4iLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwiaGFuZGxlciIsIkdFVCIsIlBPU1QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/app/api/profile/route.ts":
/*!**************************************!*\
  !*** ./src/app/api/profile/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _auth_nextauth_route__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth/[...nextauth]/route */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_1__.PrismaClient();\nasync function GET(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n    if (!session) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"No autorizado\"\n        }, {\n            status: 401\n        });\n    }\n    try {\n        // ✅ Obtener datos del usuario desde la BD\n        const user = await prisma.usuarios_ecommerce.findUnique({\n            where: {\n                id: Number(session.user.id)\n            }\n        });\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Usuario no encontrado\"\n            }, {\n                status: 404\n            });\n        }\n        // ✅ Obtener historial de compras con productos comprados\n        const historialCompras = await prisma.historial_compras_ec.findMany({\n            where: {\n                id_usuario: Number(session.user.id)\n            },\n            orderBy: {\n                fecha_hora: \"desc\"\n            },\n            include: {\n                productos_comprados: {\n                    include: {\n                        productos_ec: {\n                            select: {\n                                NomArticulo: true\n                            }\n                        }\n                    }\n                }\n            }\n        });\n        const comprasConProductos = historialCompras.map((compra)=>({\n                ...compra,\n                factura_url: compra.invoice ? `${process.env.NEXT_PUBLIC_SITE_URL || \"http://localhost:3000\"}${compra.invoice}` : null,\n                productos: compra.productos_comprados.map((p)=>({\n                        nombre: p.productos_ec.NomArticulo,\n                        cantidad: p.cantidad\n                    }))\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user,\n            historialCompras: comprasConProductos\n        }, {\n            status: 200\n        });\n    } catch (error) {\n        console.error(\"❌ Error obteniendo el perfil:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Error al obtener el perfil\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9wcm9maWxlL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBd0Q7QUFDVjtBQUNEO0FBQ2E7QUFFMUQsTUFBTUksU0FBUyxJQUFJSCx3REFBWUE7QUFFeEIsZUFBZUksSUFBSUMsR0FBZ0I7SUFDeEMsTUFBTUMsVUFBVSxNQUFNTCwyREFBZ0JBLENBQUNDLDZEQUFXQTtJQUVsRCxJQUFJLENBQUNJLFNBQVM7UUFDWixPQUFPUCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBZ0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDckU7SUFFQSxJQUFJO1FBQ0YsMENBQTBDO1FBQzFDLE1BQU1DLE9BQU8sTUFBTVAsT0FBT1Esa0JBQWtCLENBQUNDLFVBQVUsQ0FBQztZQUN0REMsT0FBTztnQkFBRUMsSUFBSUMsT0FBT1QsUUFBUUksSUFBSSxDQUFDSSxFQUFFO1lBQUU7UUFDdkM7UUFFQSxJQUFJLENBQUNKLE1BQU07WUFDVCxPQUFPWCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQXdCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUM3RTtRQUVBLHlEQUF5RDtRQUN6RCxNQUFNTyxtQkFBbUIsTUFBTWIsT0FBT2Msb0JBQW9CLENBQUNDLFFBQVEsQ0FBQztZQUNsRUwsT0FBTztnQkFBRU0sWUFBWUosT0FBT1QsUUFBUUksSUFBSSxDQUFDSSxFQUFFO1lBQUU7WUFDN0NNLFNBQVM7Z0JBQUVDLFlBQVk7WUFBTztZQUM5QkMsU0FBUztnQkFDUEMscUJBQXFCO29CQUNuQkQsU0FBUzt3QkFDUEUsY0FBYzs0QkFDWkMsUUFBUTtnQ0FDTkMsYUFBYTs0QkFDZjt3QkFDRjtvQkFDRjtnQkFDRjtZQUNGO1FBQ0Y7UUFnQ0EsTUFBTUMsc0JBQTRDWCxpQkFBaUJZLEdBQUcsQ0FBQyxDQUFDQyxTQUFtRDtnQkFDekgsR0FBR0EsTUFBTTtnQkFDVEMsYUFBYUQsT0FBT0UsT0FBTyxHQUFHLENBQUMsRUFBRUMsUUFBUUMsR0FBRyxDQUFDQyxvQkFBb0IsSUFBSSx3QkFBd0IsRUFBRUwsT0FBT0UsT0FBTyxDQUFDLENBQUMsR0FBRztnQkFDbEhJLFdBQVdOLE9BQU9OLG1CQUFtQixDQUFDSyxHQUFHLENBQUMsQ0FBQ1EsSUFBNkM7d0JBQ3hGQyxRQUFRRCxFQUFFWixZQUFZLENBQUNFLFdBQVc7d0JBQ2xDWSxVQUFVRixFQUFFRSxRQUFRO29CQUNwQjtZQUNGO1FBRUEsT0FBT3ZDLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUc7WUFBTU0sa0JBQWtCVztRQUFvQixHQUFHO1lBQUVsQixRQUFRO1FBQUk7SUFFMUYsRUFBRSxPQUFPRCxPQUFPO1FBQ2QrQixRQUFRL0IsS0FBSyxDQUFDLGlDQUFpQ0E7UUFDL0MsT0FBT1QscURBQVlBLENBQUNRLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQTZCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ2xGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS12MC1wcm9qZWN0Ly4vc3JjL2FwcC9hcGkvcHJvZmlsZS9yb3V0ZS50cz9mYjZhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoXCI7XHJcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIi4uL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiO1xyXG5cclxuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXE6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xyXG5cclxuICBpZiAoIXNlc3Npb24pIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk5vIGF1dG9yaXphZG9cIiB9LCB7IHN0YXR1czogNDAxIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIOKchSBPYnRlbmVyIGRhdG9zIGRlbCB1c3VhcmlvIGRlc2RlIGxhIEJEXHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzdWFyaW9zX2Vjb21tZXJjZS5maW5kVW5pcXVlKHtcclxuICAgICAgd2hlcmU6IHsgaWQ6IE51bWJlcihzZXNzaW9uLnVzZXIuaWQpIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVXN1YXJpbyBubyBlbmNvbnRyYWRvXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDinIUgT2J0ZW5lciBoaXN0b3JpYWwgZGUgY29tcHJhcyBjb24gcHJvZHVjdG9zIGNvbXByYWRvc1xyXG4gICAgY29uc3QgaGlzdG9yaWFsQ29tcHJhcyA9IGF3YWl0IHByaXNtYS5oaXN0b3JpYWxfY29tcHJhc19lYy5maW5kTWFueSh7XHJcbiAgICAgIHdoZXJlOiB7IGlkX3VzdWFyaW86IE51bWJlcihzZXNzaW9uLnVzZXIuaWQpIH0sXHJcbiAgICAgIG9yZGVyQnk6IHsgZmVjaGFfaG9yYTogXCJkZXNjXCIgfSxcclxuICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgIHByb2R1Y3Rvc19jb21wcmFkb3M6IHsgLy8g8J+TjCBBaG9yYSBzw60gZXhpc3RlIGVzdGEgcmVsYWNpw7NuXHJcbiAgICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICAgIHByb2R1Y3Rvc19lYzoge1xyXG4gICAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgICAgTm9tQXJ0aWN1bG86IHRydWUsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0pOyAgICBcclxuXHJcbiAgICAvLyDinIUgQWp1c3RhciBsYSByZXNwdWVzdGEgY29uIHByb2R1Y3RvcyB5IGZhY3R1cmEgVVJMIGNvbXBsZXRhXHJcbiAgICBpbnRlcmZhY2UgUHJvZHVjdG9Db21wcmFkbyB7XHJcbiAgICAgIG5vbWJyZTogc3RyaW5nO1xyXG4gICAgICBjYW50aWRhZDogbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBDb21wcmFDb25Qcm9kdWN0b3Mge1xyXG4gICAgICBpZDogbnVtYmVyO1xyXG4gICAgICBpZF91c3VhcmlvOiBudW1iZXI7XHJcbiAgICAgIGZlY2hhX2hvcmE6IERhdGU7XHJcbiAgICAgIGZhY3R1cmFfdXJsOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgICBwcm9kdWN0b3M6IFByb2R1Y3RvQ29tcHJhZG9bXTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgUHJvZHVjdG9Db21wcmFkb0RCIHtcclxuICAgICAgcHJvZHVjdG9zX2VjOiB7XHJcbiAgICAgIE5vbUFydGljdWxvOiBzdHJpbmc7XHJcbiAgICAgIH07XHJcbiAgICAgIGNhbnRpZGFkOiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIEhpc3RvcmlhbENvbXByYURCIHtcclxuICAgICAgaWQ6IG51bWJlcjtcclxuICAgICAgaWRfdXN1YXJpbzogbnVtYmVyO1xyXG4gICAgICBmZWNoYV9ob3JhOiBEYXRlO1xyXG4gICAgICBpbnZvaWNlOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgICBwcm9kdWN0b3NfY29tcHJhZG9zOiBQcm9kdWN0b0NvbXByYWRvREJbXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgY29uc3QgY29tcHJhc0NvblByb2R1Y3RvczogQ29tcHJhQ29uUHJvZHVjdG9zW10gPSBoaXN0b3JpYWxDb21wcmFzLm1hcCgoY29tcHJhOiBIaXN0b3JpYWxDb21wcmFEQik6IENvbXByYUNvblByb2R1Y3RvcyA9PiAoe1xyXG4gICAgICAuLi5jb21wcmEsXHJcbiAgICAgIGZhY3R1cmFfdXJsOiBjb21wcmEuaW52b2ljZSA/IGAke3Byb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NJVEVfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCJ9JHtjb21wcmEuaW52b2ljZX1gIDogbnVsbCxcclxuICAgICAgcHJvZHVjdG9zOiBjb21wcmEucHJvZHVjdG9zX2NvbXByYWRvcy5tYXAoKHA6IFByb2R1Y3RvQ29tcHJhZG9EQik6IFByb2R1Y3RvQ29tcHJhZG8gPT4gKHtcclxuICAgICAgbm9tYnJlOiBwLnByb2R1Y3Rvc19lYy5Ob21BcnRpY3VsbyxcclxuICAgICAgY2FudGlkYWQ6IHAuY2FudGlkYWQsXHJcbiAgICAgIH0pKSxcclxuICAgIH0pKTtcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1c2VyLCBoaXN0b3JpYWxDb21wcmFzOiBjb21wcmFzQ29uUHJvZHVjdG9zIH0sIHsgc3RhdHVzOiAyMDAgfSk7XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwi4p2MIEVycm9yIG9idGVuaWVuZG8gZWwgcGVyZmlsOlwiLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJFcnJvciBhbCBvYnRlbmVyIGVsIHBlcmZpbFwiIH0sIHsgc3RhdHVzOiA1MDAgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJQcmlzbWFDbGllbnQiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJwcmlzbWEiLCJHRVQiLCJyZXEiLCJzZXNzaW9uIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwidXNlciIsInVzdWFyaW9zX2Vjb21tZXJjZSIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwiTnVtYmVyIiwiaGlzdG9yaWFsQ29tcHJhcyIsImhpc3RvcmlhbF9jb21wcmFzX2VjIiwiZmluZE1hbnkiLCJpZF91c3VhcmlvIiwib3JkZXJCeSIsImZlY2hhX2hvcmEiLCJpbmNsdWRlIiwicHJvZHVjdG9zX2NvbXByYWRvcyIsInByb2R1Y3Rvc19lYyIsInNlbGVjdCIsIk5vbUFydGljdWxvIiwiY29tcHJhc0NvblByb2R1Y3RvcyIsIm1hcCIsImNvbXByYSIsImZhY3R1cmFfdXJsIiwiaW52b2ljZSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TSVRFX1VSTCIsInByb2R1Y3RvcyIsInAiLCJub21icmUiLCJjYW50aWRhZCIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/profile/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cicortez%5CDesktop%5CJacks%20Ecommerce&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();