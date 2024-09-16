package models

import (
	"github.com/beego/beego/v2/client/orm"
)

type Addr_Crypto struct {
	Rank        int
	Address     string
	Cryptograph string
}

func init() {
	// 注册模型
	orm.RegisterModel(new(Addr_Crypto))
}

func Add_Addr_Crypto(addr_Crypto *Addr_Crypto) (int64, error) {
	o := orm.NewOrm()
	id, err := o.Insert(addr_Crypto)
	return id, err
}
