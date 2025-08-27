import mongoose from "mongoose";

const connections = {};

export async function getDB(email){
    try{
        let db = `db_${email.replace(/[@.]/g, "_")}`;
        if(!connections[db]){
            connections[db] = await mongoose.createConnection(`${process.env.URI}/${db}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
        return connections[db];
    }
    catch(e){
        console.error("Error creating DB : " + e);
        throw e;
    }
}

const recordSchema = new mongoose.Schema({
    title: {type: String, required: true},
    expense: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    paid: {type: Boolean, default: false}
});
const notificationSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true}
});

export async function getGroupCollection(email, groupName, isNotification = false){
    try {
        const connection = await getDB(email);
        if(isNotification){
            return connection.models["notifications"] || connection.model("notifications", notificationSchema)
        }
        const collectionName = `group_${groupName.replace(/\W/g, "_")}`;
        return connection.models[collectionName] || connection.model(collectionName, recordSchema, collectionName);
    } catch (error) {
        console.error("Error getting group collection:", error);
        throw error;
    }
}
