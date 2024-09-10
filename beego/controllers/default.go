package controllers

import (
	"beego/service"

	beego "github.com/beego/beego/v2/server/web"
)

//302 temporary ->get; 305 permanent; 307 temporary ->post

type MainController struct {
	beego.Controller
}

func (c *MainController) Index() {
	c.TplName = "index.html"
}

func (c *MainController) Login() {
	var user service.User

	// 从请求体中解析数据
	if err := c.ParseForm(&user); err != nil {
		c.Ctx.Output.SetStatus(400)
		c.Ctx.WriteString("Invalid data")
		return
	}

	// 处理用户数据，例如打印用户名和密码
	if service.ValidateUser(&user) {
		c.Data["json"] = map[string]string{"status": "success"}
		c.ServeJSON()
		c.ToHomePage()
	} else {
		c.Data["json"] = map[string]string{"status": "false"}
		c.ServeJSON()
		c.Index()
	}

}

func (c *MainController) ToRegister() {
	c.TplName = "register.html"
}

func (c *MainController) Register() {
	var user service.User

	// 从请求体中解析数据
	if err := c.ParseForm(&user); err != nil {
		c.Ctx.Output.SetStatus(400)
		c.Ctx.WriteString("Invalid data")
		return
	}

	// 处理用户数据，例如打印用户名和密码
	if service.ConstructUser(&user) {
		c.Data["json"] = map[string]string{"status": "success"}
		c.ServeJSON()
		c.ToHomePage()
	} else {
		c.Data["json"] = map[string]string{"status": "false"}
		c.ServeJSON()
		c.Redirect("/user/toRegister", 302)
	}
}

func (c *MainController) ToHomePage() {
	c.TplName = "homePage.html"
}
