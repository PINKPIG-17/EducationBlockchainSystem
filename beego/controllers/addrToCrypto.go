package controllers

import (
	"beego/models"
	"encoding/json"
	"fmt"
	"github.com/beego/beego/orm"
	beego "github.com/beego/beego/v2/server/web"
	"net/http"
)

type AddrToCryptoController struct {
	beego.Controller
}

// upload->get
func (c *AddrToCryptoController) GetUpload() {
	// 检查用户是否已登录
	address := c.GetSession("address")
	if address == nil {
		fmt.Println("用户未登录")
		c.Redirect("/login", 302)
		return
	}
	c.TplName = "ipfs-upload.html"
}

// receive->get
func (c *AddrToCryptoController) GetReceive() {
	// 检查用户是否已登录
	address := c.GetSession("address")
	if address == nil {
		fmt.Println("用户未登录")
		c.Redirect("/login", 302)
		return
	}
	c.TplName = "ipfs-receive.html"
}

// upload->post
func (c *AddrToCryptoController) PostUpload() {

}

// receive->post
func (c *AddrToCryptoController) PostReceive() {
	var requestData struct {
		CID           string `json:"cid"`
		EncryptedText string `json:"encryptedText"`
		SenderAddress string `json:"senderAddress"`
		Signature     string `json:"signature"`
		Digest        string `json:"digest"`
	}

	// 解析 JSON 数据
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &requestData)
	if err != nil {
		c.Ctx.Output.SetStatus(http.StatusBadRequest)
		c.Ctx.Output.Body([]byte("Invalid JSON data"))
		return
	}

	// 创建 ORM 对象
	o := orm.NewOrm()

	// 创建 FileInfo 实例并存储数据
	addrToCryto := models.AddrToCrypto{
		Address:     requestData.SenderAddress,
		Cryptograph: requestData.EncryptedText,
		DigestHash:  requestData.Digest,
		Signature:   requestData.Signature,
	}

	// 将数据插入到数据库
	_, err = o.Insert(&addrToCryto)
	if err != nil {
		c.Ctx.Output.SetStatus(http.StatusInternalServerError)
		c.Ctx.Output.Body([]byte("Failed to store data"))
		return
	}

	// 成功响应
	c.Ctx.Output.SetStatus(http.StatusOK)
	c.Ctx.Output.Body([]byte("Data stored successfully"))
	c.TplName = "ipfs-receive.html"
}
