const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all Contacts
//@route GET /api/contacts
//@access Private
const getContacts = asyncHandler(async (req,res) =>{
    const contacts = await Contact.find({user_id: req.user._id});
    res.status(200).json(
    //     [
    //     {
    //         // "id":1,
    //         // "name":"John Doe",
    //         // "email":"meow@gmail.com",
    //         message:"Get all contacts"
    //     }
    // ]
    contacts
    );
// res.send("Hello World");
});

//@desc create new Contact
//@route POST /api/contacts
//@access Private
const createContact =  asyncHandler(async (req,res) =>{
    console.log("The request body is ", req.body);
    //error handling
    const {name,email,phone} = req.body;
    if(!name || !email || !phone){
        // return res.status(400).json({msg:"Please enter all fields"});
        //
        // res.status(400)
        // return res.json({msg:"Please enter all fields"});
        //
        res.status(400);
        throw new Error("Please enter all fields");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user._id,
    });
    res.status(201).json(
    //     [
    //     {
    //         message:"Create a new contact"
    //     }
    //    ]
    contact
    );
// res.send("Hello World");
});

//@desc Get Contact
//@route GET /api/contacts/:id
//@access Private
const getContact = asyncHandler(async (req,res) =>{
    const contact = await Contact.findById(req.params.id);
    console.log("The contact is ", contact);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
    res.status(200).json([
        {
            message: `Get contact for ${req.params.id}`
        }
    ]);
// res.send("Hello World");
});

//@desc Update Contact
//@route UPDATE /api/contacts/:id
//@access Private
const updateContact = asyncHandler(async (req,res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString !== req.user.id){
        res.status(403);
        throw new Error("Not authorized to update this contact");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true,
        }
    );

    res.status(200).json(
        // [
        // {
        //     message: `Update contact for ${req.params.id}`
        // }
        // ]
        updatedContact
    );
// res.send("Hello World");
});

//@desc Delete Contact
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact = asyncHandler(async (req,res) =>{
   try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        // console.log("The contact is ", contact);
        if (!contact) {
            res.status(404);
            throw new Error("Contact not found");
        }

        if(contact.user_id.toString !== req.user.id){
        res.status(403);
        throw new Error("Not authorized to delete this contact");
        }
        // await Contact.removeOne(); //remove the contact

        await Contact.deleteOne({ _id: req.params.id }); //remove the contact

        res.status(200).json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
// res.send("Hello World");
});

module.exports = { 
    getContacts , 
    createContact , 
    getContact , 
    updateContact,
    deleteContact,
};