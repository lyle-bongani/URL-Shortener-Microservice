@echo off
echo Testing URL Shortener API

echo.
echo 1. Testing POST with valid URL
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=https://www.example.com" http://localhost:3000/api/shorturl

echo.
echo 2. Testing POST with invalid URL
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=invalid-url" http://localhost:3000/api/shorturl

echo.
echo 3. Testing redirection (open this URL in your browser): http://localhost:3000/api/shorturl/1

echo.
pause 