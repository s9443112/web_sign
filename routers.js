exports.setRequestUrl = function (app) {

    var controller = require('./controller/controller.js');

    app.get('/', controller.index); //首頁
    app.get('/books', controller.books) //書籍庫
    app.get('/books/:name', controller.book) //選擇書籍
    app.get('/books/:name/:chapter', controller.read_book)
    app.get('/update', controller.update)
    app.get('/about', controller.about)

    app.post('/api/upload', controller.api_upload)
}