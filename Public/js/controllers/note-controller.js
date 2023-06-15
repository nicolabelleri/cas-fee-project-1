import {noteService} from "../services/note-service.js";
import Note from "../services/note.js";

class NoteController {
    constructor() {
        this.NoteTemplateCompiled = Handlebars.compile(document.getElementById('note-template').innerHTML);
        this.noteContainer = document.getElementById('note-body');
        this.newNoteForm = document.querySelector(".note-form")
        this.addNoteButton = document.getElementById('add-note');
        this.formTitle = this.newNoteForm.querySelector("#form-title");
        this.formDescription = this.newNoteForm.querySelector("#form-description");
        this.formDueDate = this.newNoteForm.querySelector("#form-dueDate");
        this.formImportance = this.newNoteForm.querySelector("#form-importance");
        this.formDone = this.newNoteForm.querySelector("#form-done");
        this.submitButton = this.newNoteForm.querySelector("#submit-button");
        this.NoteId = (event) => event.target.closest('.note-teaser').dataset
    }



    async renderNotes() {
        this.noteContainer.innerHTML = this.NoteTemplateCompiled(
            {
                notes: await noteService.loadData()
            }
        );
    };

    eventHandlers() {
        this.noteContainer.addEventListener('click', async (event) => {

            const {noteId} = this.NoteId(event);

            if (event.target.classList.contains('delete-button')) {
                await noteService.deleteNote(noteId);
                await this.renderNotes();
            }

            if (event.target.id === 'done-checkbox') {
                await noteService.setDone(noteId, event.target.checked);

                await this.renderNotes();
            }

            if (event.target.id === 'edit-button') {
                await noteService.getNote(noteId);
                await this.editForm(noteId);
                document.querySelector(".note-form").showModal();
                await this.renderNotes();
            }
        });

        this.addNoteButton.addEventListener('click', async () => {
            this.newNoteForm.showModal();
            await this.addNote();
        });
    }

    async editForm(noteId) {
        if (noteId) {
            const note =  await noteService.getNote(noteId);
            this.formTitle.value = note.title;
            this.formDescription.value = note.description;
            this.formDueDate.value = moment(note.value).format("YYYY-MM-DD");
            this.formImportance.value = note.importance;
            this.formDone.checked = note.done;
            this.submitButton.textContent = "Update";
        }

        this.submitButton.addEventListener('click', async () => {
            await this.saveNote(noteId);
            this.newNoteForm.close();
            await this.renderNotes();
        });
    }

    async addNote() {
        this.submitButton.addEventListener('click', async () => {
            await this.saveNote();
            this.newNoteForm.close();
            await this.renderNotes();
        });
    }


    async saveNote(noteId) {
        const newNote = new Note(
            this.formTitle.value,
            this.formDescription.value,
            this.formImportance.value,
            this.formDueDate.value,
            this.formDone.value,
            this.NoteId,
        );

        if (noteId) {
            await noteService.updateNote(newNote);
        }
        else {
            await noteService.createNote(newNote);
        }
    }

    async init() {
        await this.render()
        await this.eventHandlers();
    }

    async render() {
        await this.renderNotes();
    }
}


const themeButton = document.getElementById("theme-switch");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
});

new NoteController().init();