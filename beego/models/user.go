package models

import "github.com/beego/beego/v2/client/orm"

type User struct {
	Address  string `orm:"pk;size(511);unique"`
	Password string `orm:"size(255);not null"`
	Avatar   string `orm:"null"`
}

func init() {
	orm.RegisterModel(new(User))
}
