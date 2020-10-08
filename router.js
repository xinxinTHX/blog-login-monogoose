var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()



//主页
router.get('/', function(req,res){
	res.render('index.html', {
		user: req.session.user
	})
})
//登录
router.get('/login', function(req,res){
	res.render('login.html')
})
router.post('/login', function(req,res){
	
	var body = req.body
	
	User.findOne({
		email:body.email,
		password:md5(md5(body.password))
	}, function(err,user){
		if(err){
			return res.status(500).json({
			err_code:500,
			message: err.message
	})
		}
		
		if(!user){
			return res.status(200).json({
				err_code:1,
				message:'邮箱或密码无效'
			})
		}
		
		//用户存在，登录成功
		req.session.user = user
		res.status(200).json({
				err_code:0,
				message:'ok'
			})
	})
})
//注册
router.get('/register', function(req,res){
	res.render('register.html')
})

router.post('/register', function (req,res){
	var body = req.body
	User.findOne({
		$or:[{
			email:body.email
		},
		{
			nickname:body.nickname
		}]
	}, function(err,data){
		if(err){
			return res.status(500).json({
			success:false,
			message: '服务器错误'
	})
		}
		if(data){
			return res.status(200).json({
				err_code:1,
				message:'邮箱已存在'
			})
		}
		
		//对密码进行加密处理
			body.password = md5(md5(body.password))
			
			new User(body).save(function(err,user){
				if(err){
					return res.status(500).json({
						err_code:500,
						message: '服务器错误'
					})
				}
				//注册成功，使用session记录用户登录状态
				req.session.user = user
				
				
				res.status(200).json({
				err_code:0,
				message:'ok'
			})
			})
			})
})
//router.post('/register', async function(req,res){
//	var body = req.body
//	try{
//		if(await User.findOne({ email : bode.email})){
//			return res.status(200).json({
//				err_code:1,
//				message:'邮箱已存在'
//			})
//		}
//		
//		if(await User.findOne({ nickname : bode.nickname})){
//			return res.status(200).json({
//				err_code:2,
//				message:'昵称已存在'
//			})
//		}
//		
//		//对密码进行加密处理
//		body.password = md5(md5(body.password))
//		
//		//创建用户
//		await new User(body).save()
//		
//		res.status(200).json({
//			err_code:0,
//				message:'ok'
//		})
//	}
//	catch(err){
//		res.status(500).json({
//			err_code:500,
//				message: '服务器错误'
//		})
//	
//		
//	}
//})

router.get('/logout', function(req,res){
	req.session.user = null
	res.redirect('/')
	
})
module.exports = router