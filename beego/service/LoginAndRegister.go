package service

type User struct {
	Username string `json:"username" form:"username"`
	Password string `json:"password" form:"password"`
}

// func getUserName(user *user) string {
// 	return user.username
// }

// func getUserPassword(user *user) string {
// 	return user.password
// }

func ValidateUser(User *User) bool {
	return User.Username == "user" && User.Password == "123"
}

func ConstructUser(User *User) bool {
	return true
}
