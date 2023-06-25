
export default class Note {
    constructor(id, importance, dueDate, title, description, done) {
        this.id = id;
        this.importance = Number(importance);
        // eslint-disable-next-line no-undef
        this.dueDate = new Date(moment(dueDate).format("YYYY-MM-DD"));
        this.title = title;
        this.description = description;
        this.done = done;
    }
}


