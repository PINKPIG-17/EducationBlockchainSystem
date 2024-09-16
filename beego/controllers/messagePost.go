package controllers

import (
	"beego/models"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"github.com/beego/beego/orm"
	beego "github.com/beego/beego/v2/server/web"
	"github.com/pkg/errors"
	"io/ioutil"
)

// 定义控制器
type MessagePostController struct {
	beego.Controller
}

// 表单提交处理
func (c *MessagePostController) PostMessage() {
	// 获取表单数据
	address := c.GetString("address")
	text := c.GetString("text")

	// 加密长文本
	cryptograph, err := RsaEncrypt([]byte(text))
	if err != nil {
		fmt.Println(err)
		c.Ctx.WriteString("加密失败")
		return
	}

	// 存储到数据库
	message := models.Addr_Crypto{Address: address, Cryptograph: string(cryptograph)}
	_, err = models.Add_Addr_Crypto(&message)
	if err != nil {
		c.Ctx.WriteString("Error saving to database: " + err.Error())
		return
	}

	c.Ctx.WriteString("数据已成功提交")
}

// 加密
func RsaEncrypt(origData []byte) ([]byte, error) {
	// 读取公钥文件
	publicKey, err := ioutil.ReadFile("static\\key\\public.pem")
	if err != nil {
		return nil, errors.New("Read public key content error.")
	}
	// 解码
	block, _ := pem.Decode(publicKey)
	if block == nil {
		return nil, errors.New("public key error")
	}
	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, err
	}
	pub := pubInterface.(*rsa.PublicKey)
	res, err := rsa.EncryptPKCS1v15(rand.Reader, pub, origData)
	if err != nil {
		return nil, err
	}
	return res, err
}

// 解密
func RsaDecrypt(ciphertext []byte) ([]byte, error) {
	// 读取私钥文件
	privateKey, err := ioutil.ReadFile("static\\key\\private.pem")
	if err != nil {
		return nil, errors.New("Read private key content error.")
	}
	// 解码
	block, _ := pem.Decode(privateKey)
	if block == nil {
		return nil, errors.New("private key error!")
	}
	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}
	return rsa.DecryptPKCS1v15(rand.Reader, priv, ciphertext)
}

func (c *MessagePostController) Get() {
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
	c.TplName = "postMessage.html"
}
