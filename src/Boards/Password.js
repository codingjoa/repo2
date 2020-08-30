//임시 비밀번호 출력 -> 해쉬 변환 -> 확인 사실이면 true
var cryptoRandomString = require("crypto-random-string");
var bcrypt = require("bcrypt");
var pass = cryptoRandomString({length: 6});
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(pass, salt);
console.log(hash);
if(bcrypt.compareSync(pass, hash)){
    console.log(true);
}
else{
    console.log(false);
}

// 미국 유튜버가 사용하는 방법

// userSchema.pre('save', async function (next){
//   const salt = awit bcrypt.genSalt();
//   this.password = awit bcrypt.hash(this.password, salt)
//   next();
// });
