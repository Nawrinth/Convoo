import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import Connection from "../models/connection.model.js";

export const getUsers = async (req , res)=>{
    try {
        console.log("Inside getUsersForSidebar"); 
        console.log("req.user:", req.user); 

        const loggedInUserId = req.user._id;
        const search = req.query.search || ""; // get search query from request
        const regex = new RegExp(search, "i"); // case-insensitive search

        // Find users excluding the logged-in user and matching search
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
            $or: [{ fullName: regex }, { email: regex }]
        }).select("-password").limit(50); // limit for performance

        console.log("Filtered Users:", filteredUsers);
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


export const getFriendsList = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
      status: "accepted",
    });

    const friendIds = connections.map(conn =>
      conn.fromUser.equals(userId) ? conn.toUser : conn.fromUser
    );

    const friends = await User.find({ _id: { $in: friendIds } }).select(
      "-password"
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get friends list" });
  }
};


// server/controllers/message.controller.js

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const messageQuery = {
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    };

    const totalMessages = await Message.countDocuments(messageQuery);

    console.log("Total message: " , totalMessages)

    // newest first
    const messages = await Message.find(messageQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const hasMore = page * limit < totalMessages;

    res.status(200).json({
      messages,           // newest first
      currentPage: page,
      hasMore,
    });
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const sendMessage = async(req , res) =>{
    try {
        const { text , image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
            console.log(uploadResponse);
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })

        await newMessage.save()
        // TODO: real time func goes here using socket.io


        res.status(201).json(newMessage )
    } catch (error) {
        console.log("Error in sendMessage controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}