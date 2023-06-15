import Datastore from 'nedb-promises'
import Note from "./note-service.js";

export class NoteStore {
    constructor(db) {
        const options = process.env.DB_TYPE === "FILE" ? {filename: './data/orders.db', autoload: true} : {}
        this.db = db || new Datastore(options);
    }

    async add(title, description, importance, dueDate, done) {

        const note = new Note(title, description, importance, dueDate, done);
        return this.db.insert(note);
    }

    async delete(id) {
        await this.db.update({_id: id}, {$set: {"state": "DELETED"}});
        return this.get(id);
    }

    async get(id){
        return this.db.findOne({_id: id});
    }

    async all() {
        return this.db.find({state: { $ne: "DELETED" }}).sort({ orderDate: -1 }).exec();
    }

    async done(id, value) {
        return this.db.update({_id: id}, {$set: {"done": value}});
    }

    // edit note
    async edit(title, description, importance, dueDate, done, id) {
        const note = new Note(title, description, importance, dueDate, done);

        // change values in db
        return this.db.update({_id: id}, {$set: note});
    }
}

export const noteStore = new NoteStore();