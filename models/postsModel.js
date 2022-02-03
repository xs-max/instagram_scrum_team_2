const { Schema, model, Mongoose } = require("mongoose")
const bcrypt = require("bcrypt")

const reqString = {
    type: String,
    trim: true,
    
}




const PostSchema = new Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
   
    post: {
            type: String,
            trim: true,
            required: true
            
        
        
    }, 
    caption: {
        ...reqString
    },
    likes: {
        type: Number
    }
})



const Posts = model("Post", PostSchema)



module.exports = Posts;
