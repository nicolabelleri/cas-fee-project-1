import HttpService from "./http-service.js";

class NoteService {
    async createNote(title, description, importance, dueDate, done) {
        return HttpService.ajax("POST", "/notes/", { title, description, importance, dueDate, done});
    }

    async getNote(id) {
        return HttpService.ajax("GET", `/notes/${id}`, undefined);
    }

    async deleteNote(id) {
        return HttpService.ajax("DELETE", `/notes/${id}`, undefined);
    }

    async updateNote(title, description, importance, dueDate, done, id) {
        return HttpService.ajax("PUT", `/notes/${id}`, { title, description, importance, dueDate, done, id });
    }

    async setDone(id, value) {
        return HttpService.ajax("PUT", `/notes/${id}/done`, {value});
    }

    async loadData() {
        return HttpService.ajax("GET", `/notes/`, undefined);
    }


}

export const noteService = new NoteService();