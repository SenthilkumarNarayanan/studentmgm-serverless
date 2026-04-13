const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: 
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"Student",
   required:true

  },
  reason: 
  {type: String,
   required:true
  },
  fromDate: Date,
  toDate: Date,
  status: { type: String, default: "pending" }
},{ timestamps: true });

const LeaveModel = mongoose.model("Leave", leaveSchema);

module.exports = LeaveModel;