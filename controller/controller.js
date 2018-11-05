var useragent = require('express-useragent'); //判斷是否瀏覽器
var gm = require('gm') //圖形處理
var path = require('path');
var util = require('util')
var fs = require('fs')

//巴哈姆特簽名檔
exports.index = async function (req, res) {
    var source = req.headers['user-agent']
    ua = useragent.parse(source);
    console.log("作業系統: " + ua.os)
    console.log("瀏覽器是: " + ua.browser)
    console.log("IP位置是: " + req.ip)
    var p1 = "作業系統: " + ua.os;
    var p2 = "瀏覽器是: " + ua.browser
    var p3 = "IP位置是: " + req.ip
    console.log("font")
    await go(p1, p2, p3, res)
    console.log("back")



}

//書籍庫
exports.books = async function (req, res) {
    const readdir = util.promisify(fs.readdir);
    file = await readdir(__dirname + '/../static/books');
    res.render('books', {
        file: file
    })
}

//小說
exports.book = async function (req, res) {
    var name = req.params.name
    var data = fs.readFileSync(__dirname + "/../static/books/" + name, 'utf-8');

    var math_word = /\u7b2c\d/;

    var chapter_name = [];
    var chapter = data.search(math_word)

    if (data[chapter] !== undefined) {
        await math(data, /\u7b2c\d/, chapter_name)
    } else {
        await math(data, /\u7b2c\D/, chapter_name)
    }
    //console.log(JSON.stringify(chapter_name))
    res.render('book', {
        chapter: chapter_name,
        book: name
    })

}

//小說 章節
exports.read_book = async function (req, res) {
    var name = req.params.name
    var chapter = req.params.chapter
    var buffer = 0;
    var data = fs.readFileSync(__dirname + "/../static/books/" + name, 'utf-8');

    var start = data.indexOf(chapter);
    data = data.substring(start, data.length)
    var first_line = data.search(/\r/)
    //console.log("first_line "+first_line)
    if (first_line === -1) {
        first_line = data.search(/\n/)
    }
    data = data.substring(first_line, data.length)
    var last_line = data.search(/\u7b2c\d/)

    if (last_line === -1) {
        //console.log("我近來了")
        last_line = data.search(/\u7b2c\D/)
    }
    if(last_line!==-1){
        while (1) {
            if (data[last_line].search(/\u7ae0/) === 0) {
                break;
            } else {
                last_line = last_line + 1
                buffer = 1
            }
        }
    
        data = data.substring(0, last_line)
    
        if (buffer === 1) {
    
            last_line = data.lastIndexOf("第")
            console.log(last_line)
            data = data.substring(0, last_line)
        }
    }
    
    res.render('read_book', {
        data: data
    })
}


async function math(data, math_word, chapter_name) {

    while (1) {
        var chapter = data.search(math_word)
        var chapter_buffer = chapter;
        var data_name = '';
        var buffer = 0;
        var buffer_2 = 0;
        var error = 0;

        while (1) {
            if (data[chapter_buffer] === undefined) {
                break;
            }
            data_name = data_name + data[chapter_buffer]
            //console.log("123 "+data_name)
            chapter_buffer = chapter_buffer + 1;
            buffer = buffer + 1;
            if (buffer > 10) {
                error = 1;
                break;
            }
            if (data[chapter_buffer].search(/\u7ae0/) === 0) {


                var count = data.search(/\r/)

                if (count !== -1) {
                    while (1) {
                        if (data[chapter_buffer].search(/\r/) === 0) {
                            break;
                        } else {
                            data_name = data_name + data[chapter_buffer]
                            chapter_buffer = chapter_buffer + 1;
                        }
                    }
                } else {

                    while (1) {
                        if (data[chapter_buffer].search(/\n/) === 0) {
                            break;
                        } else {
                            data_name = data_name + data[chapter_buffer]
                            chapter_buffer = chapter_buffer + 1;
                        }
                    }


                }

                break;
            }
        }
        if (error !== 1) {

            if (data_name !== '') {
                chapter_name.push(data_name)
            }

            //console.log(data[chapter] + data[chapter + 1] + data[chapter + 2] + data[chapter + 3] + data[chapter + 4] + data[chapter + 5] + data[chapter + 6] + data[chapter + 7] + data[chapter + 8] + data[chapter + 9])


            if (data[chapter] === undefined) {
                break;
            } else {
                data = data.substring(chapter + buffer, data.length)
            }
        } else {
            if (data[chapter] === undefined) {
                break;
            } else {
                data = data.substring(chapter + buffer, data.length)
            }
        }

    }
}


async function go(p1, p2, p3, res) {
    var math = Math.floor(Math.random() * Math.floor(5))
    console.log("choose math is " + math)
    var img_path = './static/' + math + '.jpg';
    console.log("1")
    await gm(img_path)
        .resize(133, 133, '!')
        .write('static/' + math + '.jpg', function (err) {
            if (err) console.log(err);
        });
    var text = ""
    switch (math) {
        case 0:
            text = "蕉忍我已經識破你的肉體了"
            break;
        case 1:
            text = "今晚蕉忍陪你喔~!"
            break;
        case 2:
            text = "月英姊姊大爆射!!!"
            break;
        case 3:
            text = "嘿嘿 可i 還是可ii?"
            break;
        case 4:
            text = "要跟我打籃球ㄇ?"
            break;
        default:
            break;
    }
    console.log("2")

    await gm('./static/background.png')
        .font('./static/fonts/setofont.ttf')
        .fill("#FFBB00")

        .draw(['image over 0,0 0,0 "' + img_path + '"'])

        .fontSize(20)
        .drawText(140, 20, p1)
        .drawText(140, 45, p2)
        .drawText(140, 70, p3)
        .drawText(140, 105, text)
        .write('static/tesOutput.jpg', function (err) {
            if (err) console.log(err);
            res.sendFile(path.resolve("static/tesOutput.jpg"))
        });
    console.log("3")
}
