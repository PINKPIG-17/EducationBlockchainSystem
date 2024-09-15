package routers

import (
	"beego/controllers"

	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	beego.Router("/", &controllers.MainController{}, "get:Index")
	beego.Router("/user/login", &controllers.MainController{}, "post:Login")
	beego.Router("/user/toRegister", &controllers.MainController{}, "get:ToRegister")
	beego.Router("/homePage", &controllers.MainController{}, "get:ToHomePage;post:ToHomePage")
	beego.Router("/user/register", &controllers.MainController{}, "post:Register")
	beego.Router("/ipfs-receive", &controllers.MainController{}, "get:ToIPFSReceive")
	beego.Router("/ipfs-upload", &controllers.MainController{}, "get:ToIPFSUpload")
}
