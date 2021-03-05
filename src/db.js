import Dexie from 'dexie';

const db =  new Dexie("books")

// 卖书
db.version(1).stores({ onSaleBooks: "++id,title,author,timestamp"});
db.version(1).stores({ onSalePriceChangeLog: "++id,title,author,timestamp"});

// 买书
db.version(1).stores({ booksToBuy: "++id,title,version,timestamp"});
db.version(1).stores({ booksToBuyPriceChangeLog: "++id,title,version,timestamp"});

async function getOnSaleBook(title, author) {
    return db.onSaleBooks.where("title").equals(title).and(function (item) {
        return item.author == author;
    }).toArray();
}

async function addOnSaleBook(book) {
    let bookInfo = Object.assign(book, {
        timestamp: Date.now(),
        maxPrice: book.price,
        minPrice: book.price
    })
    return await db.onSaleBooks.add(bookInfo);
}

async function updateOnSaleBook(id, fields) {
    return await db.onSaleBooks.where("id").equals(id).modify(fields);
}

async function addOnSalePriceChangeLog(log) {
    return await db.onSalePriceChangeLog.add(log);
}

async function getBookToBuy(title, version) {
    return db.booksToBuy.where("title").equals(title).and(function (item) {
        return item.version == version;
    }).toArray();
}

async function addBookToBuy(book) {
    let bookInfo = Object.assign(book, {
        timestamp: Date.now(),
        maxPrice: book.price,
        minPrice: book.price
    })
    return await db.booksToBuy.add(bookInfo);
}

async function updateBookToBuy(id, fields) {
    return await db.booksToBuy.where("id").equals(id).modify(fields);
}

async function addBooksToBuyPriceChangeLog(log) {
    return await db.booksToBuyPriceChangeLog.add(log);
}

export {
    getOnSaleBook,
    addOnSaleBook,
    updateOnSaleBook,
    addOnSalePriceChangeLog,
    getBookToBuy,
    addBookToBuy,
    updateBookToBuy,
    addBooksToBuyPriceChangeLog
};
