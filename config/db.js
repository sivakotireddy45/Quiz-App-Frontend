import mongoose from "mongoose"; 

export const connectDB = async () => { 
    await mongoose.connect('mongodb+srv://sasibrucelee1_db_user:quizapp12@quiz.ueanqzo.mongodb.net/') 
    .then(() => { 
        console.log("MongoDB connected successfully"); 
    }) 
}