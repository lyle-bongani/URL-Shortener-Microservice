# URL Shortener Microservice

This is a simple URL shortener microservice that allows you to:
1. Submit a URL and receive a shortened URL in return
2. Use the shortened URL to be redirected to the original URL

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone this repository:
```
git clone https://github.com/yourusername/url-shortener-microservice.git
cd url-shortener-microservice
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortener
```

4. Start the application:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## API Usage

### Create a Short URL

**POST /api/shorturl**

Request body:
```
{
  "url": "https://example.com"
}
```

Response:
```
{
  "original_url": "https://example.com",
  "short_url": 1
}
```

If the URL is invalid, you'll receive:
```
{
  "error": "invalid url"
}
```

### Use a Short URL

**GET /api/shorturl/:short_url**

This will redirect you to the original URL.

## Testing

Visit `http://localhost:3000` in your browser to use the web interface.

## Project Structure

- `index.js`: Main server file
- `config/db.js`: Database connection configuration
- `models/Url.js`: MongoDB model for URL schema
- `routes/api.js`: API routes for URL shortener
- `public/`: Frontend files (HTML, CSS) 