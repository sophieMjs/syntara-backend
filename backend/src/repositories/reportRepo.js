const { ReportModel } = require("../models/Report");

class ReportRepository {
    async createReport(data) {
        return ReportModel.create(data);
    }

    async updateStatus(reportId, status, downloadUrl = null, data = null) {
        return ReportModel.findByIdAndUpdate(
            reportId,
            { status, downloadUrl, data, generatedAt: new Date() },
            { new: true }
        );
    }

    async getReport(reportId) {
        return ReportModel.findById(reportId);
    }

    async getUserReports(userId) {
        return ReportModel.find({ userId }).sort({ createdAt: -1 });
    }
}

module.exports = ReportRepository;
