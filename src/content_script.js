// import {$,jQuery} from './static/jquery.min';

$(document).ready(function () {
    console.log("ready~~");
    console.log(window.location.pathname);
    setTimeout(async () => {
        await checkBuyBooksPrice()
    }, 2000);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkSellBooksPrice(task) {
    console.log("start content ~~~");
    await sleep(2000);
    $(".added-sell-items").each(function () {
        let item = $(this);
        var booksInfo = [];
        item.find(".SelItem").each(function () {
            console.log($(this).find(".title").text());
            console.log($(this).find(".Price--normal").text());
            let title = $(this).find(".title").text();
            let author = $(this).find(".description").text();
            let priceString = $(this).find(".Price--normal").text().replace("¥", "");
            let price = Math.floor(parseFloat(priceString) * 100);
            booksInfo.push({
                title: title,
                author: author,
                price: price
            })
        })
        chrome.runtime.sendMessage({
            type: "sellPriceCheck",
            content: {
                books: booksInfo
            }
        }, function (response) {
            console.log("Response: ", response);
        })
        // item.find(".Price--normal").each(function () {
        //     let tmp = $(this);
        //     console.log(tmp.text())
        // })
    })
    console.log("end content ~~~");
}

async function checkBuyBooksPrice() {
    console.log("start~~");
    let booksInfo = [];
    $(".SelItem").each(function () {
        let title = $(this).find(".book-title").text();
        let version = $(this).find(".book-quality").text();
        let priceString = $(this).find(".Price--normal").text().replace("¥", "");
        let price = Math.floor(parseFloat(priceString) * 100);
        if (title != "") {
            booksInfo.push({
                title: title,
                version: version,
                price: price
            });
        }
    });
    console.log("books info: ", booksInfo);
    chrome.runtime.sendMessage({
        type: "buyPriceCheck",
        content: {
            books: booksInfo
        }
    }, function (response) {
        console.log("Response: ", response);
    })
}
