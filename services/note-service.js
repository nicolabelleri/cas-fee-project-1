export default class Note {
    constructor(title, description, importance, dueDate, done, id) {
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.done = done;
        this.id = id;
    }
}