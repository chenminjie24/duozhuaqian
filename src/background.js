// import {$,jQuery} from './static/jquery.min';

import {
    addBooksToBuyPriceChangeLog, addBookToBuy,
    addOnSaleBook,
    addOnSalePriceChangeLog,
    getBookToBuy,
    getOnSaleBook,
    updateBookToBuy,
    updateOnSaleBook
} from "./db";

chrome.runtime.onInstalled.addListener(() => {
    // alert('duozhuaqian 安装成功~');
    chrome.alarms.create("test", {delayInMinutes: 1, periodInMinutes: 1});
    console.log("start~~~");
    let domId = "duozhuaqian";
    let iframeDom = `<iframe id="${domId}" width="400 px" height="600 px" src="https://www.duozhuayu.com/cart"></iframe>`;
    $('body').append(iframeDom);
})

// 定时任务
chrome.alarms.onAlarm.addListener(alarm => {
    console.log(new Date(), alarm);
    let domId = "duozhuaqian";
    let iframeDom = `<iframe id="${domId}" width="400 px" height="600 px" src="https://www.duozhuayu.com/cart"></iframe>`;
    $('body').append(iframeDom);
});

// 处理消息
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    switch (msg.type) {
        case 'sellPriceCheck':
            setTimeout(async () => {
                await sellPriceCheck(msg.content.books);
            }, 100);
            break;
        case 'buyPriceCheck':
            setTimeout(async () => {
                await buyPriceCheck(msg.content.books);
            }, 100);
            break;

    }
})

// 检查买入书籍价格变化情况
async function buyPriceCheck(booksInfo) {
    var booksName = [];
    localStorage.setItem("dzq_buy_books", booksInfo);
    for (let index in booksInfo) {
        let bookInfo = booksInfo[index];
        var book = await getBookToBuy(bookInfo.title, bookInfo.version);
        if (book.length > 0) {
            if (book[0].price > bookInfo.price) {
                booksName.push(book[0].title);
                var fields = {
                    price: bookInfo.price
                }
                if (book[0].minPrice > bookInfo.price) {
                    fields.minPrice = bookInfo.price
                }
                await updateBookToBuy(book[0].id, fields);
                await addBooksToBuyPriceChangeLog(bookInfo)
            } else if (book.price < booksInfo.price) {
                var fields = {
                    price: bookInfo.price
                }
                if (book[0].maxPrice < bookInfo.price) {
                    fields.maxPrice = bookInfo.price
                }
                await updateBookToBuy(book[0].id, fields);
                await addBooksToBuyPriceChangeLog(bookInfo)
            } else {
                console.log("Nothing happened.", book);
            }
        } else {
            console.log("new book~")
            booksName.push(bookInfo.title);
            await addBookToBuy(bookInfo);
            await addBooksToBuyPriceChangeLog(bookInfo);
        }
    }
    if (booksName.length > 0) {
        let content = "";
        for (let index in booksName) {
            content += "<<" + booksName[index] + ">>" ;
        }
        chrome.notifications.create(new Date().getTime().toString(), {
            type: 'basic',
            iconUrl: 'static/image/panda.png',
            title: '降价啦~',
            message: content
        }, function (notificationId) {

        });
    }
}

// 检查卖出书籍价格变化情况
async function sellPriceCheck(booksInfo) {
    var booksName = [];
    localStorage.setItem("dzq_sell_books", booksInfo);
    for (let index in booksInfo) {
        let bookInfo = booksInfo[index];
        var book = await getOnSaleBook(bookInfo.title, bookInfo.author);
        if (book.length > 0) {
            if (book[0].price < bookInfo.price) {
                booksName.push(book[0].title);
                var fields = {
                    price: bookInfo.price
                }
                if (book[0].maxPrice < bookInfo.price) {
                    fields.maxPrice = bookInfo.price
                }
                await updateOnSaleBook(book[0].id, fields);
                await addOnSalePriceChangeLog(bookInfo)
            } else if (book.price > booksInfo.price) {
                var fields = {
                    price: bookInfo.price
                }
                if (book[0].minPrice > bookInfo.price) {
                    fields.minPrice = bookInfo.price
                }
                await updateOnSaleBook(book[0].id, fields);
                await addOnSalePriceChangeLog(bookInfo)
            } else {
                console.log("Nothing happened.", book);
            }
        } else {
            console.log("new book~")
            await addOnSaleBook(bookInfo);
            await addOnSalePriceChangeLog(bookInfo);
        }
    }
    if (booksName.length > 0) {
        let content = "";
        for (let index in booksName) {
            content += "<<" + booksName[index] + ">>" ;
        }
        chrome.notifications.create(new Date().getTime().toString(), {
            type: 'basic',
            iconUrl: 'static/image/panda.png',
            title: '涨价啦~',
            message: content
        }, function (notificationId) {

        });
    }
}
