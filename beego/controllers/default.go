package controllers

import (
	"beego/service"
	"encoding/json"

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
	if err := json.NewDecoder(c.Ctx.Request.Body).Decode(&user); err != nil {
		c.Ctx.Output.SetStatus(400)
		c.Ctx.WriteString("Invalid data")
		return
	}
	// 处理用户数据，例如打印用户名和密码
	if service.ValidateUser(&user) {
		c.Ctx.Output.SetStatus(200) //success
		c.ServeJSON()
	} else {
		c.Ctx.Output.SetStatus(401) //unauthorized
		c.ServeJSON()
	}

}

func (c *MainController) ToRegister() {
	c.TplName = "register.html"
}

func (c *MainController) Register() {
	var user service.User

	// 从请求体中解析数据
	if err := json.NewDecoder(c.Ctx.Request.Body).Decode(&user); err != nil {
		c.Ctx.Output.SetStatus(400)
		c.Ctx.WriteString("Invalid data")
		return
	}
	// 处理用户数据，例如打印用户名和密码
	if service.ConstructUser(&user) {
		c.Ctx.Output.SetStatus(200)
		c.ServeJSON()
	} else {
		c.Ctx.Output.SetStatus(401)
		c.ServeJSON()
	}
}

func (c *MainController) ToHomePage() {
	c.TplName = "homePage.html"

}

func (c *MainController) ToIPFSReceive() {
	c.TplName = "ipfs-recive.html"
}

func (c *MainController) ToIPFSUpload() {
	c.TplName = "ipfs-upload.html"
}
