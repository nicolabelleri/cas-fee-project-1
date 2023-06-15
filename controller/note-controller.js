import {noteStore} from "../services/note-store.js";

export class NoteController {

    getNotes = async (req, res) => {
        res.json((await noteStore.all() || []))
    }

    createNote = async (req, res) => {
        res.json(await noteStore.add(req.body.title, req.body.description, req.body.importance, req.body.dueDate, req.body.done));
    };

    showNote = async (req, res) => {
        res.json(await noteStore.get(req.params.id));
    };

    deleteNote = async (req, res) => {
        res.json(await noteStore.delete(req.params.id));
    };

    editNote = async (req, res) => {
        res.json(await noteStore.edit(req.body.title, req.body.description, req.body.importance, req.body.dueDate, req.body.done, req.params.id));
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