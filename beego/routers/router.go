package routers

import (
	"beego/controllers"

	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	//beego.Router("/", &controllers.MainController{}, "get:Index")
	//beego.Router("/user/login", &controllers.MainController{}, "post:Login")
	//beego.Router("/user/toRegister", &controllers.MainController{}, "get:ToRegister")
	//beego.Router("/homePage", &controllers.MainController{}, "get:ToHomePage;post:ToHomePage")
	//beego.Router("/user/register", &controllers.MainController{}, "post:Register")

	beego.Router("/register", &controllers.UserController{}, "get:Get;post:Register")
	beego.Router("/login", &controllers.UserController{}, "get:GetLogin;post:Login")
	beego.Router("/messagePost", &controllers.MessagePostController{}, "get:Get;post:PostMessage")
	beego.Router("/", &controllers.MainController{}, "get:Index")
	beego.Router("/uploadAvatar", &controllers.UserController{}, "get:GetAvatar;post:UploadAvatar")
	beego.Router("/home", &controllers.UserController{}, "get,post:Home")
	beego.Router("/logout", &controllers.UserController{}, "get:Logout")
	beego.Router("/upload", &controllers.AddrToCryptoController{}, "get:GetUpload;post:PostUpload")
	beego.Router("/receive", &controllers.AddrToCryptoController{}, "get:GetReceive;post:PostReceive")
	beego.Router("/show", &controllers.ShowInfoController{}, "get:ShowDataByAddress")
}
