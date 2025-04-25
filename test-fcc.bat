@echo off
echo Testing URL Shortener for freeCodeCamp tests

echo.
echo Testing valid URL submission:
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=https://www.freecodecamp.org" http://localhost:3000/api/shorturl

echo.
echo Testing invalid URL:
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=ftp://invalid-url" http://localhost:3000/api/shorturl

echo.
echo Testing non-existent URL:
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "url=https://invalid.thisisnotarealdomainforsure.com" http://localhost:3000/api/shorturl

echo.
echo Testing redirection - open this URL in your browser:
echo http://localhost:3000/api/shorturl/1

pause 