package models

import "github.com/beego/beego/orm"

// 定义数据模型
type AddrToCrypto struct {
	Id          int    `orm:"auto"`           // 自增ID
	Address     string `orm:"size(511);null"` // 地址
	Cryptograph string `orm:"size(511);null"` // 加密后的数据
	DigestHash  string `orm:"size(511);null"` // 哈希摘要
	Signature   string `orm:"size(511);null"` // 签名
}

func init() {
	// 注册模型
	orm.RegisterModel(new(AddrToCrypto))
}
