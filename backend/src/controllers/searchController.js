// controllers/searchController.js
const SearchService = require("../services/searchService");
const searchService = new SearchService();

exports.search = async (req, res) => {
    try {
        // Leemos de req.query (parámetros de URL).
        // 💡 clientDate se lee aquí
        const { product, quantity, unit, clientDate } = req.query;
        const userId = req.user?.id || null;

        // Convertimos quantity a número, ya que req.query son strings
        const numericQuantity = quantity ? parseInt(quantity, 10) : undefined;

        // --- LOG DE DIAGNÓSTICO 1 ---
        // 💡 Añadimos clientDate al log para confirmar recepción
        console.log("➡️ [SearchController] 1. Parámetros recibidos y validados:", { product, quantity: numericQuantity, unit, userId, clientDate });

        console.log("⏳ [SearchController] 2. Llamando a searchService.search... (Esperando AWAIT)");

        // 🛑 LA EJECUCIÓN SE DETIENE AQUÍ SI HAY UN BLOQUEO
        const data = await searchService.search({
            userId,
            product,
            quantity: numericQuantity,
            unit,
            clientDate // 💡 CORRECCIÓN: Pasar clientDate al servicio
        });

        // --- LOG DE DIAGNÓSTICO 2 (Si este log aparece, el servicio resolvió exitosamente) ---
        console.log("✅ [SearchController] 3. El servicio de búsqueda ha respondido.");

        // Línea añadida para mostrar el resultado de la búsqueda por consola
        console.log("[SearchController] Resultado de la búsqueda:", data);

        res.status(200).json({
            success: true,
            message: "Búsqueda realizada correctamente.",
            data
        });
    } catch (error) {
        // --- LOG DE DIAGNÓSTICO 3 (Si este log aparece, el servicio falló/lanzó una excepción) ---
        console.error("❌ [SearchController] ERROR atrapado:", error.message);
        console.error("[SearchController] Detalles del Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};