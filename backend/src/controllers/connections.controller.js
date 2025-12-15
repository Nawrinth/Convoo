import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";

export const getPendingConnections = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await Connection.find({
      status: "pending",
      $or: [{ fromUser: loggedInUserId }, { toUser: loggedInUserId }],
    }); // fetch only needed fields

    const pendingUsers = connections.map(conn =>
      conn.fromUser.equals(loggedInUserId) ? conn.toUser : conn.fromUser
    );

    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotificationUsers = async (req , res) =>{
  try {
      const loggedInUserId = req.user._id;
      const connections = await Connection.find({status:"pending", toUser:loggedInUserId});
      const notificationUsers = connections.map(conn => conn.fromUser);
      const userDetails = await User.find({_id: {$in: notificationUsers}}, '-password'); 
      res.status(200).json(userDetails);

  } catch (error) {
      res.status(500).json({ message: error.message });
  }

}

export const deleteConnection = async (req, res) => {
  try {
    const { fromId } = req.body;
    const existingConnection = await Connection.findOne({fromUser:fromId , toUser:req.user._id });
   
    if (!existingConnection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    await Connection.findOneAndDelete({fromUser:fromId , toUser:req.user._id });
    res.status(200).json({ message: "Connection deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateConnectionStatus = async (req, res, newStatus) => {
  try {
    const { fromId } = req.body;

    // Use findOne instead of find to get a single document
    const existingConnection = await Connection.findOne({
      fromUser: fromId,
      toUser: req.user._id,
    });

    if (!existingConnection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    existingConnection.status = newStatus;
    await existingConnection.save();

    res.status(200).json(existingConnection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const createConnection = async (req, res) => {
  
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user._id;

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { fromUser: fromUserId, toUser: toUserId },
        { fromUser: toUserId, toUser: fromUserId },
      ],
    });
    if (existingConnection) {
      return res.status(400).json({ message: "Connection already exists" });
    }
    const newConnection = new Connection({
      fromUser: fromUserId,
      toUser: toUserId,
      status: "pending",
    });
    await newConnection.save();
    res.status(201).json(newConnection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

