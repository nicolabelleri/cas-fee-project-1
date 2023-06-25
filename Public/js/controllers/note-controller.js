import NoteService from "../services/note-service.js";
import Note from "../services/note.js";

class NoteController {
    constructor() {
        this.noteService = new NoteService();
        // eslint-disable-next-line no-undef
        this.NoteTemplateCompiled = Handlebars.compile(document.getElementById('note-template').innerHTML);
        // eslint-disable-next-line no-undef,func-names
        Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        });
        this.noteContainer = document.getElementById('note-body');
        this.newNoteForm = document.querySelector(".note-form")
        this.addNoteButton = document.getElementById('add-note');
        this.closeButton = document.getElementById("close");
        this.formTitle = this.newNoteForm.querySelector("#form-title");
        this.formDescription = this.newNoteForm.querySelector("#form-description");
        this.formDueDate = this.newNoteForm.querySelector("#form-dueDate");
        this.formImportance = this.newNoteForm.querySelector("#form-importance");
        this.formDone = this.newNoteForm.querySelector("#form-done");
        this.submitButton = this.newNoteForm.querySelector("#submit-button");
        this.sortContainer = document.getElementById('sort-container');
        this.filterContainer = document.getElementById('filter-container');

        this.currentSortBy = null;
        this.currentSort = null;
        this.currentFilter = null;
    }

    async renderNotes(sortBy, order, filter) {
        this.currentSortBy = sortBy || this.currentSortBy;
        this.currentSort = order || this.currentSort;
        this.currentFilter = filter || this.currentFilter;

        let notes = await this.noteService.loadData(this.currentSortBy, this.currentSort, this.currentFilter);
        notes = notes.map(note => ({
            ...note,
            // eslint-disable-next-line no-undef
            dueDate: moment(note.dueDate).format('DD.MM.YYYY')
        }));

        this.noteContainer.innerHTML = this.NoteTemplateCompiled({notes});
    }

    eventHandlers() {
        this.noteContainer.addEventListener('click', async (event) => {
            const {noteId} = event.target.closest('.note-teaser').dataset;


            if (event.target.classList.contains('delete-button')) {
                await this.noteService.deleteNote(noteId);
                await this.renderNotes();
            }

            if (event.target.id === `done-checkbox-${noteId}`) {
                await this.noteService.setDone(noteId, event.target.checked);
                await this.renderNotes();
            }

            if (event.target.id === 'edit-button') {
                await this.editForm(noteId);
            }
        });

        this.addNoteButton.addEventListener('click', async () => {
            this.formTitle.value = "";
            this.formDescription.value = "";
            this.formDueDate.value = "";
            this.formImportance.value = "1";
            this.newNoteForm.showModal();
            await this.addForm();
        });

        this.sortContainer.addEventListener('click', async (event) => {
            this.sortContainer.querySelectorAll('.active').forEach((el) => {
                el.classList.remove('active');
            });

            let newSortOrder;
            if (event.target.dataset.sort === "asc") {
                newSortOrder = 'desc';
            } else {
                newSortOrder = 'asc';
            }

            if (event.target.id === 'sort-importance') {
                await this.renderNotes("importance", newSortOrder, this.currentFilter);
                event.target.classList.add('active');
            }
            if (event.target.id === 'sort-date') {
                await this.renderNotes("dueDate", newSortOrder, this.currentFilter);
                event.target.classList.add('active');
            }

            event.target.setAttribute('data-sort', newSortOrder);
        });

        this.filterContainer.addEventListener('click', async (event) => {
            if (event.target.id === 'filter-done') {
                if (event.target.classList.contains('active')) {
                    event.target.classList.remove('active');
                    await this.renderNotes(this.currentSortBy, this.currentSort, "active");
                    event.target.innerHTML = "Done"
                } else {
                    event.target.classList.add('active');
                    await this.renderNotes(this.currentSortBy, this.currentSort, "done");
                    event.target.innerHTML = "Active"
                }
            }
            if (event.target.id === 'filter-cancel') {
                this.currentFilter = undefined;
                await this.renderNotes(this.currentSortBy, this.currentSort, this.currentFilter);
                this.filterContainer.querySelectorAll('.active').forEach((el) => {
                    el.classList.remove('active');
                });
            }

            if (event.target.id !== 'filter-done') {
                this.sortContainer.querySelectorAll('.active').forEach((el) => {
                    el.classList.remove('active');
                });
                this.filterContainer.querySelectorAll('.active').forEach((el) => {
                    el.classList.remove('active');
                });
            }
        });

        this.closeButton.addEventListener("click", () => {
            this.newNoteForm.close();
        });
    }

    async addForm() {
        this.submitButton.textContent = "Add";
        this.newNoteForm.querySelector("#dialog-title").textContent = "Add note";

        this.newNoteForm.removeEventListener('submit', this.saveNoteHandler);

        this.saveNoteHandler = async (event) => {
            event.preventDefault();
            await this.saveNote();
            this.newNoteForm.close();
            await this.renderNotes();
        };

        this.newNoteForm.addEventListener('submit', this.saveNoteHandler);
    }

    async editForm(noteId) {
        const newForm = this.newNoteForm.cloneNode(true);
        this.newNoteForm.parentNode.replaceChild(newForm, this.newNoteForm);
        this.newNoteForm = newForm;

        this.reselectFormElements();

        // define dialogTitle here
        const dialogTitle = this.newNoteForm.querySelector("#dialog-title");

        // reset the form fields
        this.formTitle.value = "";
        this.formDescription.value = "";
        this.formDueDate.value = "";
        this.formImportance.value = "1";
        this.formDone.checked = false;

        // now if the noteId exists, populate the form with existing note data
        if (noteId) {
            const note = await this.noteService.getNote(noteId);
            this.formTitle.value = note.title;
            this.formDescription.value = note.description;
            // eslint-disable-next-line no-undef
            this.formDueDate.value = moment(note.dueDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.formImportance.value = note.importance;
            this.formDone.checked = note.done;
            this.submitButton.textContent = "Update";
            dialogTitle.textContent = "Edit note";

            // Remove the previous submit event listener, if it exists
            this.newNoteForm.removeEventListener('submit', this.saveNoteHandler);

            // Add the new submit event listener
            this.saveNoteHandler = async (event) => {
                event.preventDefault();
                await this.saveNote(noteId);
                this.newNoteForm.close();
                await this.renderNotes();
            };

            this.newNoteForm.addEventListener('submit', this.saveNoteHandler);
        }
        this.newNoteForm.querySelector("#close").addEventListener("click", () => {
            this.newNoteForm.close();
        });

        this.newNoteForm.showModal();
    }

    reselectFormElements() {
        this.formTitle = this.newNoteForm.querySelector("#form-title");
        this.formDescription = this.newNoteForm.querySelector("#form-description");
        this.formDueDate = this.newNoteForm.querySelector("#form-dueDate");
        this.formImportance = this.newNoteForm.querySelector("#form-importance");
        this.formDone = this.newNoteForm.querySelector("#form-done");
        this.submitButton = this.newNoteForm.querySelector("#submit-button");
    }

    async saveNote(noteId) {
        const newNote = new Note(
            noteId,
            this.formImportance.value,
            this.formDueDate.value,
            this.formTitle.value,
            this.formDescription.value,
            this.formDone.checked
        );

        if (noteId) {
            await this.noteService.updateNote(newNote);
        } else {
            await this.noteService.createNote(newNote);
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

new NoteController().init();


const themeButton = document.getElementById("theme-switch");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
});
