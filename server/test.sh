# @codingjoa
# 테스트 코드

curl -X POST -H 'Content-Type: application/json' -d '{ "id":"ky", "pw":"dlatlqlqjs" }' http://localhost:3307/api/auth/login
curl -X POST -H 'Content-Type: application/json' -d '{ "id":"ky", "pw":"1234" }' http://localhost:3307/api/auth/login
curl -X POST -H 'Content-Type: application/json' -d '{ "id":"history", "name":"홍일식" }' http://localhost:3307/api/db/teacher
curl -X POST -H 'Content-Type: application/json' -d '{ "id":"hong3", "name":"홍일식" }' http://localhost:3307/api/db/teacher
