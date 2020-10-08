var express =  require('express')
var path = require('path')
var session = require('express-session')
var router = require('./router')
var bodyParser = require('body-parser')
//创建app
var app = express()

//开放文件
//__dirname可以动态获取当前文件模块所属目录的绝对路径
app.use('/css/', express.static(path.join(__dirname, './css/')))
app.use('/img/', express.static(path.join(__dirname,'./img/')))
app.use('/js/', express.static(path.join(__dirname,'./js/')))
app.use('/node_modules/', express.static(path.join(__dirname,'./node_modules/')))


//配置模板引擎
app.engine('html', require('express-art-template'))

app.set('views', path.join(__dirname, './views/'))    //默认为views目录

//配置body-parser
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//配置session
app.use(session({
  secret: 'keyboard cat',//加密字符串itcast 
  resave: false,
  saveUninitialized: true
}))



 
//将路由挂载到APP中
app.use(router)



//全局处理中间件
app.use(function(req,res){
	res.render('404.html')
})


//输出端口号
app.listen(3000 , function(){
	console.log('running.......')
})
