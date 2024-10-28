import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        certificateId:{
            type: String,
            required: true
        },
        studentName: {
            type: String,
            required: [true, "Please provide your name"],
        },
        domain: {
            type: String,
            // enum: ["Web Development", "UI/UX Design", "Machine Learning", "Cyber Security"],
            required: [true, "Please provide your domain"],
        },
        duration: {
            type: Number,
            enum: [1, 2, 3],
            required: [true, "Please provide the duration"],
        },
        startDate: {
            type: Date,
            required: [true, "Please provide the start date"],
        },
        endDate: {
            type: Date,
            required: [true, "Please provide the end date"],
        },
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;