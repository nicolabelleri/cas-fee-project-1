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

    async get(id) {
        return this.db.findOne({_id: id});
    }

    async all(sortBy = 'dueDate', order = 'asc', filter = 'all') {
        const query = {state: {$ne: "DELETED"}};

        if (filter === 'done') {
            query.done = true;
        } else if (filter === 'active') {
            query.done = false;
        }

        const sortQuery = order === 'desc' ? -1 : 1;
        return this.db.find(query).sort({[sortBy]: sortQuery}).exec();
    }

    async done(id, value) {
        return this.db.update({_id: id}, {$set: {"done": value}});
    }

    async edit(title, description, importance, dueDate, done, id) {
        const note = new Note(title, description, importance, dueDate, done);
        return this.db.update({_id: id}, {$set: note});
    }
}

export const noteStore = new NoteStore();