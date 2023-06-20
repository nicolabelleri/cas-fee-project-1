import {noteStore} from "../services/note-store.js";

export class NoteController {

    getNotes = async (req, res) => {
        try {
            const { sortBy, sort, filter } = req.query;
            console.log(sortBy, sort, filter);
            res.json((await noteStore.all(sortBy, sort, filter) || []))
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    createNote = async (req, res) => {
        try {
            res.json(await noteStore.add(req.body.title, req.body.description, req.body.importance, req.body.dueDate, req.body.done));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    showNote = async (req, res) => {
        try {
            res.json(await noteStore.get(req.params.id));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    deleteNote = async (req, res) => {
        try {
            res.json(await noteStore.delete(req.params.id));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    editNote = async (req, res) => {
        try {
            res.json(await noteStore.edit(req.body.title, req.body.description, req.body.importance, req.body.dueDate, req.body.done, req.params.id));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    setDone = async (req, res) => {
        try {
            res.json(await noteStore.done(req.params.id, req.body.value));
        }
        catch (e) {
            res.status(500).json({error: e.message});
        }
    }

}

export const noteController = new NoteController();