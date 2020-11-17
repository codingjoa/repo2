# repo2
**싸발면**
따라 하세요

## 1. 설치
1. git bash를 설치할 것
[git bash] (https://gitforwindows.org/)
2. node.js(14.2.0 버전 이상) 설치할 것(ecma2020 때문임!!)
[node.js] (https://nodejs.org/ko/download/)
3. mariadb(10.3.25 버전 이상) 설치할 것(mysql에서 테스트 안 해봄!!)
[mariadb] (https://mariadb.org/download/#entry-header)
4. heidisql을 설치
[HeidiSQL] (https://www.heidisql.com/download.php)

### 2. node.js 모듈을 모두 설치
1. repo2 폴더에서 node modules 설치 `npm i` 또는 `npm install` 필요한 모듈들을 **알아서 설치해** 줍니다.
2. pm2 설치 `npm i pm2@latest -g`

### 3. mariadb 세팅하기
1. `./server/sql/v1.sql` SQL을 **root 계정에서** 실행할 것
```bash
sudo mysql -u root -p {비밀번호} < ./server/sql/v1.sql
# heidisql 쿼리 입력창에 v1.sql 내용 복붙
```

## 3. 시작하는 방법

1. 처음 실행할 때
```bash
pm2 start ecosystem.config.js
```

2. 이후 실행시
```bash
pm2 start all
```

### 4. 서버 닫기
```bash
pm2 stop all
```

참 쉽죠?
