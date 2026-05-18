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

    static async currentlyAt(id: string, page: number) {
        const book = await BookModel.findById(id);
        if (!book) throw new Error('Livre non trouvé');
        book.pagesRead = page;
        return await book.save();
    }

    static async changeStatus(id: string, status: string) {
        const book = await BookModel.findById(id);
        if (!book) throw new Error('Livre non trouvé');
        book.status = status;

        if (status === 'Read') {
            book.pagesRead = book.pages;
            book.finished = true;
        } else if (status === 'Currently reading' && book.pagesRead === 0) {
            book.pagesRead = 1;
            book.finished = false;
        } else {
            book.finished = false;
        }

        return await book.save();
    }

    static async deleteBook(id: string) {
        return await BookModel.findByIdAndDelete(id);
    }

    static async markAsFinished(id: string) {
        const book = await BookModel.findById(id);
        if (!book) throw new Error('Livre non trouvé');
        book.finished = true;
        book.status = 'Read';
        book.pagesRead = book.pages;
        return await book.save();
    }
}