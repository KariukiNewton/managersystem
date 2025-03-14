const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to another user (supervisor)
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract'],
        required: true,
    },
    workLocation: {
        type: String,
    },
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String,
    }],
});

module.exports = mongoose.model('Employee', employeeSchema);
