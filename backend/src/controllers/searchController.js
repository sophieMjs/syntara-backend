// controllers/searchController.js
const SearchService = require("../services/searchService");
const searchService = new SearchService();

exports.search = async (req, res) => {
    try {
        const { product, quantity, unit, stores } = req.body;
        const userId = req.user?.id || null;

        const data = await searchService.search({ userId, product, quantity, unit, stores });

        res.status(200).json({
            success: true,
            message: "Búsqueda realizada correctamente.",
            data
        });
    } catch (error) {
        console.error("[SearchController]", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
