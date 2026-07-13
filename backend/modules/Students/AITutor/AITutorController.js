const AITutor = require("./AITutorModel");

// Create New Chat
exports.createChat = async (req,res)=>{

    try{

        const chat = await AITutor.create({

            studentId:"student-1",

            subject:req.body.subject,

            title:req.body.title

        });

        res.status(201).json({

            success:true,

            message:"Conversation created.",

            data:chat

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Send Message
exports.sendMessage = async(req,res)=>{

    try{

        const chat = await AITutor.findOne({

            _id:req.params.id,

            studentId:"student-1"

        });

        if(!chat){

            return res.status(404).json({

                success:false,

                message:"Conversation not found."

            });

        }

        chat.messages.push({

            role:"student",

            message:req.body.message

        });

        chat.messages.push({

            role:"assistant",

            message:"🤖 AI service will be integrated soon."

        });

        await chat.save();

        res.json({

            success:true,

            message:"Message added.",

            data:chat

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Conversation History
exports.getHistory = async(req,res)=>{

    try{

        const history = await AITutor.find({

            studentId:"student-1"

        });

        res.json({

            success:true,

            data:history

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Get Single Chat
exports.getConversation = async(req,res)=>{

    try{

        const chat = await AITutor.findOne({

            _id:req.params.id,

            studentId:"student-1"

        });

        if(!chat){

            return res.status(404).json({

                success:false,

                message:"Conversation not found."

            });

        }

        res.json({

            success:true,

            data:chat

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Delete Chat
exports.deleteConversation = async(req,res)=>{

    try{

        await AITutor.findOneAndDelete({

            _id:req.params.id,

            studentId:"student-1"

        });

        res.json({

            success:true,

            message:"Conversation deleted."

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Future AI
exports.askAI = async(req,res)=>{

    res.json({

        success:true,

        message:"FastAPI + RAG integration coming soon."

    });

};