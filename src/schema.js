import mongoose from "mongoose";
const mySchema = mongoose.Schema({
    reg: Number,
    thing: String,
    deadline: Date,
});

 export const myModel = mongoose.model('Task', mySchema)