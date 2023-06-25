import moment from "moment";

export default class Note {
    constructor(title, description, importance, dueDate, done, id) {
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = moment(dueDate).format("YYYY-MM-DD");
        this.done = done;
        this.id = id;
    }
}