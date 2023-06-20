import HttpService from "./http-service.js";

export default class NoteService {
    constructor() {
        this.httpService = new HttpService();
    }

    async createNote(note) {
        return this.httpService.ajax("POST", "/notes/", { ...note });
    }

    async getNote(id) {
        return this.httpService.ajax("GET", `/notes/${id}`, undefined);
    }

    async deleteNote(id) {
        return this.httpService.ajax("DELETE", `/notes/${id}`, undefined);
    }

    async updateNote(note) {
        return this.httpService.ajax("PUT", `/notes/${note.id}`, { ...note });
    }

    async setDone(id, value) {
        return this.httpService.ajax("PUT", `/notes/${id}/done`, {value});
    }

    async loadData(sortBy, sort, filter) {
        const params = new URLSearchParams();
        if(sortBy) params.append('sortBy', sortBy);

        if(sort) params.append('sort', sort);
        if(filter) params.append('filter', filter);
        console.log(params.toString());
        return this.httpService.ajax("GET", `/notes/?${params.toString()}`, undefined);
    }
}
