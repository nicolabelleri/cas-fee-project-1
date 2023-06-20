export default class Note {
    constructor(title, description, importance, dueDate, done, id) {
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.done = done;
        this.id = id;
    }

    // setImportance(importance) {
    //     if (importance === "low") {
    //         this.importance = 1;
    //     } else if (importance === "medium") {
    //         this.importance = 2;
    //     } else if (importance === "high") {
    //         this.importance = 3;
    //     }
    //     return this.importance;
    // }
}