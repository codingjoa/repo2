# repo2 설치 가이드

수동으로 production 서버에 배포하는 방법을 알아봅니다.

설치 과정에서 발생하는 오류를 줄이기 위해 설치 과정을 순서대로 진행하기 바랍니다.

## 1. 설치

### 1-1. 필요한 프로그램 모두 설치

1. git bash를 설치할 것 (윈도우)
[git bash](https://gitforwindows.org/)
2. node.js(14.2.0 버전 이상) 설치할 것(ecma 문법 지원 문제 때문임!!)
[node.js](https://nodejs.org/ko/download/)
3. mariadb(10.3.25 버전 이상) 설치할 것(mysql에서 테스트 안 해봄!!)
[mariadb](https://mariadb.org/download/#entry-header)
4. heidisql을 설치(옵션)
[HeidiSQL](https://www.heidisql.com/download.php)

### 1-2. node.js 모듈을 모두 설치

1. repo2 폴더에서 node modules 설치 `npm i` 또는 `npm install` 필요한 모듈들을 **알아서 설치해** 줍니다.
2. pm2 설치 `npm i pm2@latest -g`
3. 이미 설치된 경우라도 queryString 모듈이 1.4.0 버전부터 추가되었으니 실행해주세요.
4. `npm run build` 실행 꼭 해주세요! 그래야 리액트 서버를 쓸 수 있습니다.

### 1-3. mariadb 세팅하기

1. `./server/sql/deploy.sql` SQL을 **root 계정에서** 실행할 것

```bash
sudo mysql -u root -p < ./server/sql/deploy.sql
# heidisql 쿼리 입력창에 v1.sql 내용 복붙
```

## 2. 시작하는 방법

1. 처음 실행할 때(혹은 재부팅 시마다)

```bash
pm2 start ecosystem.config.js
```

2. 이후 실행시

```bash
pm2 start ecosystem.config.js
```

또는

```bash
pm2 start all
```

## 3. 서버 닫기

```bash
pm2 stop all
```

## 번외1. changelog

1.5.4 (2021-06-14)
1. 이제 관리자는 선생님의 모든 출석부를 관리(대행)할 수 있습니다.

1.5.3 (2021-05-12)
1. 수업 철회 내용이 사라지지 않는 심각한 문제 해결
2. 이제 출석부의 학생 목록도 이름순으로 정렬됩니다.

1.5.2 (2021-05-08)
1. 미납금에 팀 또는 학생 검색이 추가되었습니다.

1.5.1 (2021-05-08)

1.5.0 (2021-05-08)

1.4.0 (2021-03-26)

1.3.0 (2021-02-14)
1. src: 일반유저는 비밀번호 변경 페이지에 접근할 수 없던 버그 수정
2. src: useSession 코드 개선
3. src: 내비게이션 바 구조 일부 수정
4. src: 그 외 코드 전반적인 개선...
5. src: 정산 페이지 날짜 지정 기능 추가
6. server: 날짜 지정 기능 적용(1.4에서 다시 변경될 예정)

1.2.1 (2021-01-04)
1. server: addLesson에 포함되지 않는 NotFound 함수를 호출하는 버그 수정
2. src: QuarterList의 렌더링 방식 변경
3. `poolConfig.js` 에서 `poolManager.config.js`로 변경
4. pm2: ecosystem.config.js 변경

1.2.0 (2020-12-04)
1. 주차수 선택 가능
2. 수업 결과 창 변경

1.1.0 (2020-11-29)
1. 수업 마감하면 이상한 곳으로 가던 버그 수정
2. 수업 일수를 자율적으로 조정 가능
3. 그 외 디자인 구린거 수정

1.0.1 (2020-11-22)

1.0.0 (2020-11-17)

참 쉽죠?
