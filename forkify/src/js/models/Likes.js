export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, publisher, image) {
        const like = {
            id,
            title,
            publisher,
            image
        };
        this.likes.push(like);

        //persist the data in the local storage
        this.persistData();
        return like;
    }

    removeLike(id) {
        const index = this.likes.findIndex(curr => curr.id === id);
        this.likes.splice(index, 1);
        //delete from local storage
    }

    isLiked(id) {
        return this.likes.findIndex(curr => curr.id === id) !== -1;
    }

    getNumberLikes () {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        //restore the likes from storage
        if (storage) this.likes = storage;
    }
}