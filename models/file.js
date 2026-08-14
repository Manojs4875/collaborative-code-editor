const mongoose=require('mongoose');
const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: "javascript"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("File", fileSchema);