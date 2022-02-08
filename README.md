# 학원관리 프로그램 (외주제작)

학원의 요청으로 학생 및 수업료, 출석 관리를 제공하는 전용 웹 애플리케이션을 개발하는 작업을 진행한 경험이 있습니다.

React와 Node.js를 사용한 풀스택 개발이 가능하며 MariaDB를 활용한 전자기록부 또는 게시판을 구현할 수 있습니다.

ES6 문법이 적용되었고 [라즈베리파이](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) 리눅스 환경에서 개발하였습니다.

> 개발 기간: 2020.08.10 ~ 2021.05.12 <br />
> 개발 인원: 2명

## 기술 스택

<table>
  <tr>
    <th>Front-End</th>
    <td>React, material-ui</td>
  </tr>
  <tr>
    <th>Back-End</th>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <th>Database</th>
    <td>MariaDB</td>
  </tr>
  <tr>
    <th>etc.</th>
    <td>PM2, Github, Linux</td>
  </tr>
</table>

## 주요기능 미리보기

<table>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase1.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>로그인</b><br />
      - 인가된 사용자만 접근할 수 있으며 처음 접속시 로그인 화면이 나옵니다.<br />
      - 로그인은 세션을 사용합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase2.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>학생 관리</b><br />
      - 학생의 인적사항을 등록하고 관리하는 페이지입니다.<br />
      - 일반 강사는 사용할 수 없는 페이지입니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase3.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>팀 관리</b><br />
      - 팀을 생성하고 관리할 수 있습니다.<br />
      - 수업은 팀 단위로 운영되기 때문에 학생과 강사가 배정될 팀을 생성하여야 합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase4.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>강사 관리</b><br />
      - 출석부를 관리할 강사의 계정을 등록하고 관리하는 페이지입니다.<br />
      - 첫 계정 생성시 임시 비밀번호가 생성되며, 비밀번호 변경은 로그인 후 가능합니다.<br />
      - 비밀번호를 잊은 경우 관리자가 직접 비밀번호를 초기화해야 합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase5.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>출석부 관리 (출석부 발행)</b><br />
      - 출석부를 발행하려면 먼저 학생 배정과 학생들의 수업료 입금 여부를 등록해야 합니다.<br />
      - 입금이 완료되지 않고 수업을 듣는 경우, 외상 등록 후 미납금 목록에서 확인할 수 있습니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase6.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>출석부 관리 (학생 중도 등록 및 환불)</b><br />
      - 출석부는 한 달 단위로 발행하기 때문에 중도에 편성하거나 환불할 경우 발행된 출석부에 이를 반영할 수 있습니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase7.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>출석부 관리 (출석 등록 및 출석부 마감)</b><br />
      - 학생들의 출석을 등록하고 수업이 모두 끝나면 수동으로 마감을 해야 합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase8.gif?raw=true" width="600"/>
    </td>
    <td>
      <b>담당 출석부 관리</b><br />
      - 강사가 자신이 담당하는 출석부를 조회하고 출석을 등록합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase9.jpg?raw=true" width="600"/>
    </td>
    <td>
      <b>수업료 정산</b><br />
      - 세금 계산서에 반영할 수 있도록 강사 별 수업료를 조회합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase10.jpg?raw=true" width="600"/>
    </td>
    <td>
      <b>미납금 조회</b><br />
      - 학생 및 날짜 별 미납된 수업료를 조회합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase11.jpg?raw=true" width="600"/>
    </td>
    <td>
      <b>환불금 조회</b><br />
      - 환불 수업료를 조회합니다.
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/codingjoa/repo2/blob/master/docs/phase12.jpg?raw=true" width="600"/>
    </td>
    <td>
      <b>비밀번호 변경</b><br />
      - 강사 자신의 계정 비밀번호를 변경합니다.
    </td>
  </tr>
</table>

## Lesson Learned

### 리액트 생명주기
개발과 공부를 동시에 진행했던 저의 첫 리액트 프로젝트입니다. 리액트의 렌더링 방식에 대한 기반 지식 없이 axios 라이브러리를 사용했을 때 무한 렌더링 문제가 발생하여 React의 생명 주기를 배웠습니다.

### SQL 쿼리 튜닝
개발 단계에서는 속도 문제는 발견하지 못하였으나 실제 데이터를 등록 및 운용한 결과 속도가 저하되어 학생 목록이 함께 출력되는 [출석부 조회](https://github.com/codingjoa/repo2/blob/668589acf980e76a130970635adfa17532a2a0d0/server/v1/fetchWaitLessons.js)의 경우 학생 정보 200개 이상일 때 1개 페이지 조회에 5초가 걸리는 심각한 문제가 있었습니다.

이를 해결하기 위해 SQL의 쿼리 튜닝을 배우고 [재설계](https://github.com/codingjoa/repo2/commit/4c310a64126dd4a80e83261723901439de935b36#diff-0d6821743ce769c5d2088a5226e893f18b11820d5083713bd382995cac801173)하여 반영한 결과 0.5초로 단축할 수 있었습니다.

테스트 서버의 적은 데이터로는 발견하기 힘든 최적화 문제가 있다는 것을 알게 되었습니다.

### 잘못된 데이터 삽입
쿼리 작성 실수로 [바인딩 문자 '?' 가 아닌 상수](https://github.com/codingjoa/repo2/commit/b0ce29ad3a787cdabbf743de23aad40930d70f14#diff-539684a92132cb90b9d053fc0f8c5e1967263a4670c1c4d87235134528e5a97e)를 삽입하여서 실제 서버에 잘못된 데이터가 삽입된 적이 있었습니다.

이를 해결하기 위해 MariaDB의 프로시저 사용법을 배우고, [코드](https://github.com/codingjoa/repo2/blob/master/server/sql/solution1.sql)를 작성하여 잘못 삽입된 데이터를 삭제하여 완전히 해결했습니다.

전용 프로그램이기 때문에 큰 영향은 없었지만 오류 검사와, 데이터베이스 백업의 중요성을 몸소 겪고 예방책을 강구하는 계기가 되지 않았나 싶습니다.
