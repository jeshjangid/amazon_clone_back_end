const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL


//Database connection
const conn = mongoose.connection;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
},
(error, link) => {
    // check database connect error
    assert.strictEqual(error, null, 'DB Connect Fail...');



    // database connect success
    console.log('connection established...');
}
);
 