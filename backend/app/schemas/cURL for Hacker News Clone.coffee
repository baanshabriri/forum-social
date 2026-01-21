""cURL for Hacker News Clone""

curl -X 'POST' \
  'http://localhost:8000/posts/' \
  -H 'accept: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzY4OTkyOTY0fQ.pVv9OchMTQdaATKIzpJfj2s84_lztOSFMjD-SG4Lu54' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "TEST3",
  "url": "https://example.com/",
  "text": "TEST3"
}'

curl -X 'GET' \
  'http://localhost:8000/auth/me' \
  -H 'accept: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzY4OTkyOTY0fQ.pVv9OchMTQdaATKIzpJfj2s84_lztOSFMjD-SG4Lu54'



curl -X 'POST' \
  'http://localhost:8000/posts/1/vote?value=-1' \
  -H 'accept: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzY4OTkyOTY0fQ.pVv9OchMTQdaATKIzpJfj2s84_lztOSFMjD-SG4Lu54' \  
  -d ''