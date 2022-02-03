const Post = require("../models/postsModel")


const upload = async(req, res)=>{
    const newPost = await User.create({
        post,caption, likes
    })

newPost.save()
res.send({ message: "Picture uploaded successfully"})
}



module.exports = {
    upload
}