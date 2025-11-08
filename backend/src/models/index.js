// index.js - reexportar modelos para import más limpio
const { UserEntity, UserModel } = require('./User');
const { SubscriptionEntity, SubscriptionModel } = require('./Subscription');
const { PriceRecordEntity, PriceRecordModel } = require('./PriceRecord');
const { SearchEntity, SearchModel } = require('./Search');
const { ReportEntity, ReportModel } = require('./Report');

module.exports = {
    UserEntity, UserModel,
    SubscriptionEntity, SubscriptionModel,
    PriceRecordEntity, PriceRecordModel,
    SearchEntity, SearchModel,
    ReportEntity, ReportModel
};
