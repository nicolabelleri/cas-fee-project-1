import express from 'express';
import {noteController} from '../controller/note-controller.js';

const router = express.Router();

router.get("/", noteController.getNotes);
router.post("/", noteController.createNote);
router.put("/:id", noteController.editNote);
router.put("/:id/done/", noteController.setDone);
router.get("/:id/", noteController.showNote);
router.delete("/:id/", noteController.deleteNote);

export default router;