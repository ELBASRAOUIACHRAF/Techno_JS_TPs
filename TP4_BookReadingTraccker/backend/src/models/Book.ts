import BookModel from './BookModel';

export class Book {
    constructor(
        public title: string,
        public author: string,
        public pages: number,
        public status: string,
        public price: number,
        public pagesRead: number,
        public format: string,
        public suggestedBy: string
    ) {}

    // Sauvegarder un nouveau livre
    async save() {
        const payload = {
            title: this.title,
            author: this.author,
            pages: this.pages,
            status: this.status,
            price: this.price,
            pagesRead: this.pagesRead,
            format: this.format,
            suggestedBy: this.suggestedBy,
        };
        console.log('Attempting to save book:', payload);
        const newBook = new BookModel(payload);
        return await newBook.save();
    }

    // Mettre à jour la page actuelle (déclenche le pre-save si terminé)
    static async currentlyAt(id: string, page: number) {
        const book = await BookModel.findById(id);
        if (!book) throw new Error('Livre non trouvé');
        book.pagesRead = page;
        return await book.save();
    }

    // Supprimer un livre
    static async deleteBook(id: string) {
        return await BookModel.findByIdAndDelete(id);
    }

    // Action du Checkbox (Marquer comme lu)
    static async markAsFinished(id: string) {
        const book = await BookModel.findById(id);
        if (!book) throw new Error('Livre non trouvé');
        book.finished = true;
        book.status = 'Read';
        book.pagesRead = book.pages;
        return await book.save();
    }
}