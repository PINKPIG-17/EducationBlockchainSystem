package controllers

import (
	"beego/models"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"github.com/beego/beego/orm"
	beego "github.com/beego/beego/v2/server/web"
	"os"
	"path"
	"time"
)

type UserController struct {
	beego.Controller
}

func init() {
	err := orm.RegisterDataBase("default", "mysql", "root:040424tzh@tcp(127.0.0.1:3306)/eduSys_Database?charset=utf8")
	if err != nil {
		fmt.Println("register database error:", err)
	}

	orm.RegisterModel(new(models.User))
	// 检查是否成功注册了 default 别名
	db, _ := orm.GetDB("default")
	if db == nil {
		fmt.Println("No database alias 'default' found.")
		return
	} else {
		fmt.Println("Database alias 'default' is registered successfully.")
	}
}

func (c *UserController) EditUserInfo() {
	c.TplName = "editInfo.html"
}

func (c *UserController) Get() {
	//err := orm.RegisterDataBase("default", "mysql", "root:123456@tcp(127.0.0.1:3306)/eduSys_Database?charset=utf8")
	//if err != nil {
	//	fmt.Println("register database error:", err)
	//}
	//
	//orm.RegisterModel(new(models.User))
	//// 检查是否成功注册了 default 别名
	//db, _ := orm.GetDB("default")
	//if db == nil {
	//	fmt.Println("No database alias 'default' found.")
	//	c.Ctx.WriteString("No database alias 'default' found.")
	//	return
	//} else {
	//	fmt.Println("Database alias 'default' is registered successfully.")
	//}

	// 正常处理页面渲染
	c.TplName = "register.html"
}

// 注册用户
func (c *UserController) Register() {
	db, _ := orm.GetDB("default")
	if db == nil {
		fmt.Println("No database alias 'default' found.")
	} else {
		fmt.Println("==========Database alias 'default' is registered successfully.=========")
	}
	if c.Ctx.Input.IsPost() {
		address := c.GetString("address")
		password := c.GetString("password")

		// 密码加密
		hashedPassword := hashPassword(password)

		// 插入用户到数据库
		o := orm.NewOrm()
		o.Using("default")
		user := models.User{Address: address, Password: hashedPassword}
		_, err := o.Insert(&user)
		if err != nil {
			c.Data["Message"] = "用户名已存在"
			c.TplName = "register.html"
			return
		}

		c.Redirect("/login", 302)
	} else {
		c.TplName = "register.html"
	}
}

func (c *UserController) GetLogin() {
	//err := orm.RegisterDataBase("default", "mysql", "root:123456@tcp(127.0.0.1:3306)/eduSys_Database?charset=utf8")
	//if err != nil {
	//	fmt.Println("register database error:", err)
	//}
	//
	//orm.RegisterModel(new(models.User))
	//// 检查是否成功注册了 default 别名
	//db, _ := orm.GetDB("default")
	//if db == nil {
	//	fmt.Println("No database alias 'default' found.")
	//	c.Ctx.WriteString("No database alias 'default' found.")
	//	return
	//} else {
	//	fmt.Println("Database alias 'default' is registered successfully.")
	//}

	// 正常处理页面渲染
	c.TplName = "login.html"
}

// 登录用户
func (c *UserController) Login() {
	if c.Ctx.Input.IsPost() {
		address := c.GetString("address")
		password := c.GetString("password")

		// 密码加密验证
		hashedPassword := hashPassword(password)

		fmt.Println("查找用户中")
		// 查找用户
		o := orm.NewOrm()
		user := models.User{Address: address}
		err := o.Read(&user, "Address")
		if err == orm.ErrNoRows || user.Password != hashedPassword {
			fmt.Println("用户名或密码错误")
			c.Data["Message"] = "用户名或密码错误"
			c.TplName = "login.html"
			return
		}

		// 登录成功，设置会话
		c.SetSession("address", address)
		fmt.Println("登录成功")
		c.Redirect("/home", 302)
	} else {
		c.TplName = "login.html"
	}
}

// 密码加密函数
func hashPassword(password string) string {
	hash := md5.New()
	hash.Write([]byte(password))
	return hex.EncodeToString(hash.Sum(nil))
}

// 头像上传get
func (c *UserController) GetAvatar() {
	// 检查用户是否已登录
	address := c.GetSession("address")
	if address == nil {
		c.Redirect("/login", 302)
		return
	}

	// 从数据库获取用户信息
	o := orm.NewOrm()
	user := models.User{Address: address.(string)}
	err := o.Read(&user, "Address")
	if err != nil {
		c.Data["Error"] = "用户不存在"
	}

	// 将用户信息传递给模板
	c.Data["User"] = user
	c.TplName = "userInfoUpload.html"
}

// 头像上传post
func (c *UserController) UploadAvatar() {
	// 确保用户已登录
	address := c.GetSession("address")
	if address == nil {
		c.Redirect("/login", 302)
		return
	}

	// 获取上传的文件
	file, header, err := c.GetFile("avatar")
	if err != nil {
		c.Data["Error"] = "获取文件失败"
		c.TplName = "userInfoUpload.html"
		return
	}
	defer file.Close()

	// 验证文件类型（可选，但推荐）
	ext := path.Ext(header.Filename)
	allowedExt := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
	}
	if !allowedExt[ext] {
		c.Data["Error"] = "文件类型不支持"
		c.TplName = "userInfoUpload.html"
		return
	}

	// 创建保存路径
	uploadDir := "static/uploads/avatar/"
	os.MkdirAll(uploadDir, os.ModePerm)
	// 生成唯一的文件名，防止冲突
	filename := fmt.Sprintf("%s_%d%s", address, time.Now().Unix(), ext)
	filepath := path.Join(uploadDir, filename)

	// 保存文件
	err = c.SaveToFile("avatar", filepath)
	if err != nil {
		c.Data["Error"] = "文件保存失败"
		c.TplName = "userInfoUpload.html"
		return
	}

	// 更新用户头像路径
	o := orm.NewOrm()
	user := models.User{Address: address.(string)}
	if err = o.Read(&user, "Address"); err == nil {
		user.Avatar = "/" + filepath // 存储相对路径，方便前端访问
		if _, err = o.Update(&user, "Avatar"); err == nil {
			c.Data["Success"] = "头像上传成功"
		} else {
			c.Data["Error"] = "更新头像信息失败"
		}
	} else {
		c.Data["Error"] = "用户不存在"
	}

	c.TplName = "userInfoUpload.html"
}

// user登陆后home
func (c *UserController) Home() {
	// 检查用户是否已登录
	address := c.GetSession("address")
	if address == nil {
		fmt.Println("用户未登录")
		c.Redirect("/login", 302)
		return
	}

	// 从数据库获取用户信息
	o := orm.NewOrm()
	user := models.User{Address: address.(string)}
	err := o.Read(&user, "Address")
	if err != nil {
		c.Data["Error"] = "用户不存在"
	}

	// 将用户信息传递给模板
	c.Data["User"] = user
	c.TplName = "userHomePage.html"
}

// 退出登录
func (c *UserController) Logout() {
	// 清除用户的会话
	c.DelSession("address")

	// 重定向到登录页面
	c.Redirect("/login", 302)
}

// userInfoGet
func (c *UserController) GetUserInfo() {
	// 检查用户是否已登录
	address := c.GetSession("address")
	if address == nil {
		fmt.Println("用户未登录")
		c.Redirect("/login", 302)
		return
	}

	// 从数据库获取用户信息
	o := orm.NewOrm()
	user := models.User{Address: address.(string)}
	err := o.Read(&user, "Address")
	if err != nil {
		c.Data["Error"] = "用户不存在"
	}

	// 将用户信息传递给模板
	c.Data["User"] = user

	c.TplName = "userInfo.html"
}
