const mongoose = require('mongoose');

class ReportEntity {
    constructor({ userId = null, query = '', status = 'pending', generatedAt = null, downloadUrl = null, data = null, createdAt = new Date() } = {}) {
        this.userId = userId;
        this.query = query;
        this.status = status;
        this.generatedAt = generatedAt;
        this.downloadUrl = downloadUrl;
        this.data = data;
        this.createdAt = createdAt;
    }
}

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    query: { type: String },
    status: { type: String, enum: ['pending', 'ready', 'failed'], default: 'pending' },
    generatedAt: { type: Date, default: null },
    downloadUrl: { type: String, default: null },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now }
});

const ReportModel = mongoose.model('Report', reportSchema);
module.exports = { ReportEntity, ReportModel };

