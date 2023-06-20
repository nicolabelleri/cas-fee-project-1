import NoteService from "../services/note-service.js";
import Note from "../services/note.js";

class NoteController {
    constructor() {
        this.noteService = new NoteService();
        this.NoteTemplateCompiled = Handlebars.compile(document.getElementById('note-template').innerHTML);
        Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        });
        this.noteContainer = document.getElementById('note-body');
        this.newNoteForm = document.querySelector(".note-form")
        this.addNoteButton = document.getElementById('add-note');
        this.formTitle = this.newNoteForm.querySelector("#form-title");
        this.formDescription = this.newNoteForm.querySelector("#form-description");
        this.formDueDate = this.newNoteForm.querySelector("#form-dueDate");
        this.formImportance = this.newNoteForm.querySelector("#form-importance");
        this.formDone = this.newNoteForm.querySelector("#form-done");
        this.submitButton = this.newNoteForm.querySelector("#submit-button");
        this.sortContainer = document.getElementById('sort-container');
        this.filterContainer = document.getElementById('filter-container');
        this.NoteId = (event) => event.target.closest('.note-teaser').dataset;
        this.currentSortBy = null;
        this.currentSort = null;
        this.currentFilter = null;
    }


    async renderNotes(sortBy, order, filter) {
        this.currentSortBy = sortBy || this.currentSortBy;
        this.currentSort = order || this.currentSort;
        this.currentFilter = filter || this.currentFilter;
        console.log(this.currentSort);

        const notes = await this.noteService.loadData(this.currentSortBy, this.currentSort, this.currentFilter);

        this.noteContainer.innerHTML = this.NoteTemplateCompiled({ notes });
    }


    eventHandlers() {
        this.noteContainer.addEventListener('click', async (event) => {

            const {noteId} = this.NoteId(event);

            if (event.target.classList.contains('delete-button')) {
                await this.noteService.deleteNote(noteId);
                await this.renderNotes();
            }

            if (event.target.id === 'done-checkbox') {
                await this.noteService.setDone(noteId, event.target.checked);

                await this.renderNotes();
            }

            if (event.target.id === 'edit-button') {
                await this.noteService.getNote(noteId);
                await this.editForm(noteId);
                document.querySelector(".note-form").showModal();
                await this.renderNotes();
            }
        });

        this.addNoteButton.addEventListener('click', async () => {
            this.formTitle.value = "";
            this.formDescription.value = "";
            this.formDueDate.value = "";
            this.formImportance.value = "";
            this.formDone.checked = false;

            this.newNoteForm.showModal();
            await this.addNote();
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
                } else {
                    event.target.classList.add('active');
                    await this.renderNotes(this.currentSortBy, this.currentSort, "done");
                }
            }
            // If any other button in the filter container is clicked, remove 'active' class from all buttons.
            if (event.target.id !== 'filter-done') {
                this.sortContainer.querySelectorAll('.active').forEach((el) => {
                    el.classList.remove('active');
                });
                this.filterContainer.querySelectorAll('.active').forEach((el) => {
                    el.classList.remove('active');
                });
            }
        });
    }




    async editForm(noteId) {
        this.submitButton.replaceWith(this.submitButton.cloneNode(true));
        this.submitButton = this.newNoteForm.querySelector("#submit-button");

        if (noteId) {
            const note =  await this.noteService.getNote(noteId);
            this.formTitle.value = note.title;
            this.formDescription.value = note.description;
            this.formDueDate.value = moment(note.dueDate, "DD.MM.YYYY").format("YYYY-MM-DD");
            this.formImportance.value = note.importance;
            this.formDone.checked = note.done;
            this.submitButton.textContent = "Update";

            this.submitButton.addEventListener('click', async () => {
                await this.saveNote(noteId);
                this.newNoteForm.close();
                await this.renderNotes();
            });
        }
    }

    async addNote() {
        this.submitButton.replaceWith(this.submitButton.cloneNode(true));
        this.submitButton = this.newNoteForm.querySelector("#submit-button");

        this.submitButton.addEventListener('click', async () => {
            await this.saveNote();
            this.newNoteForm.close();
            await this.renderNotes();
        });
    }


    async saveNote(noteId) {
        const newNote = new Note(
            noteId,
            this.formImportance.value,
            moment(this.formDueDate.value).format("DD.MM.YYYY"),
            this.formTitle.value,
            this.formDescription.value,
            this.formDone.checked
        );
        if (noteId) {
            await this.noteService.updateNote(newNote);
        }
        else {
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

