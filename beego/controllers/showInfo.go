package controllers

import (
	"beego/models"
	"github.com/beego/beego/orm"
	beego "github.com/beego/beego/v2/server/web"
)

type ShowInfoController struct {
	beego.Controller
}

func (c *ShowInfoController) ShowDataByAddress() {
	// 获取用户输入的地址
	address := c.GetString("address")
	if address == "" {
		c.Data["json"] = []string{}
		c.ServeJSON()
		return
	}

	// 查询数据库中符合该地址的所有记录，并按 Id 升序排序
	o := orm.NewOrm()
	var results []models.AddrToCrypto
	_, err := o.QueryTable("addr_to_crypto").Filter("address", address).OrderBy("Id").All(&results)
	if err != nil {
		c.Data["json"] = []string{} // 查询出错，返回空数组
		c.ServeJSON()
		return
	}

	// 将查询结果以 JSON 格式返回
	c.Data["json"] = results
	c.ServeJSON()
}
