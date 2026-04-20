const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title:String,
    description:String,
    fileUrl:String,
},{
    timestamps: true

});

const NotificationModel = mongoose.model("Notification",notificationSchema);

module.exports = NotificationModel;