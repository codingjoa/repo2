# repo2
**싸발면**

## 개발 환경
### 프로그램
mariadb-server 10.3.25
node.js 14.2.0
mysql 15.1

### node modules
react 16.13.1...
***더 이상의 자세한 설명은 생략한다.***
```
cat package.json
```

## 설치
1. node.js 버전을 14 이상으로 설치할 것*(ecma2020 때문임!!)*
2. mariadb 버전을 10 이상으로 설치할 것*(mysql에서 테스트 안 해봄!!)*
3. node modules 설치 `npm i` 또는 `npm install`
4. `./server/sql/vq.sql` SQL을 **root 계정에서** 실행할 것

## 시작하는 방법
```
pm2 start ecosystem.config.js
```

참 쉽죠?