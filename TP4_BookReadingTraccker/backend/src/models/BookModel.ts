import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    pages: number;
    status: 'Read' | 'Re-read' | 'DNF' | 'Currently reading' | 'Returned Unread' | 'Want to read';
    price: number;
    pagesRead: number;
    format: 'Print' | 'PDF' | 'Ebook' | 'AudioBook';
    suggestedBy: string;
    finished: boolean;
}

const BookSchema: Schema<IBook> = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    status: { type: String, enum: ['Read', 'Re-read', 'DNF', 'Currently reading', 'Returned Unread', 'Want to read'], default: 'Want to read' },
    price: { type: Number, required: true },
    pagesRead: { type: Number, default: 0 },
    format: { type: String, enum: ['Print', 'PDF', 'Ebook', 'AudioBook'], required: true },
    suggestedBy: { type: String },
    finished: { type: Boolean, default: false }
});

// Logique automatique : mettre à jour le statut selon les pages lues
BookSchema.pre('save' as any, async function (this: IBook) {
    if (this.pagesRead >= this.pages) {
        this.finished = true;
        this.status = 'Read';
    } else if (this.pagesRead > 0 && this.pagesRead < this.pages) {
        this.status = 'Currently reading';
        this.finished = false;
    } else if (this.pagesRead === 0) {
        this.finished = false;
        // Ne pas changer le statut si c'est 0 (peut être 'Want to read', 'Returned Unread', etc)
    }
});

export default mongoose.model<IBook>('Book', BookSchema);