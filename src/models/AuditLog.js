const mongoose = require('mongoose');  
  
const AuditLogSchema = new mongoose.Schema({  
    action: String,  
    entity: String,  
    entityId: String,  
    details: Object,  
    timestamp: { type: Date, default: Date.now }  
});  
  
module.exports = mongoose.model('AuditLog', AuditLogSchema); 
