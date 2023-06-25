import {noteStore} from "../services/note-store.js";

export class NoteController {

    async getNotes(req, res) {
        try {
            const { sortBy, sort, filter } = req.query;
            res.json((await noteStore.all(sortBy, sort, filter) || []));
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    async createNote(req, res) {
        try {
            res.json(await noteStore.add(req.body.title, req.body.description, req.body.importance, req.body.dueDate, req.body.done));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    async showNote(req, res) {
        try {
            res.json(await noteStore.get(req.params.id));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    async deleteNote(req, res) {
        try {
            res.json(await noteStore.delete(req.params.id));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    async editNote(req, res) {
        try {
            res.json(await noteStore.edit(req.body.title, req.body.description, req.body.importance, req.body.dueDate, req.body.done, req.params.id));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    async setDone(req, res) {
        try {
            res.json(await noteStore.done(req.params.id, req.body.value));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }
}

export const noteController = new NoteController();