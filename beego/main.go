package main

import (
	_ "beego/routers"
	"fmt"
	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	orm.RegisterDriver("mysql", orm.DRMySQL)
	err := orm.RegisterDataBase("default", "mysql", "root:040424tzh@tcp(127.0.0.1:3306)/eduSys_Database?charset=utf8")
	if err != nil {
		fmt.Println("register database error:", err)
	}
	err = orm.RunSyncdb("default", false, true)
	if err != nil {
		fmt.Println(err)
	}
}

func main() {

	db, _ := orm.GetDB("default")
	if db == nil {
		fmt.Println("No database alias 'default' found.")
	} else {
		fmt.Println("Database alias 'default' is registered successfully.")
	}
	beego.Run()
}
