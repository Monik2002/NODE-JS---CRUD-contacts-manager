const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_STRING);
        // , {
        //     // The following options are to prevent deprecation warnings
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useFindAndModify: false
        // });
        console.log(`MongoDB connected: ${conn.connection.host} , ${conn.connection.name}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDb;