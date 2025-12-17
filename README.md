# JSON Resume
# PDF-Ready HTML Resume from JSON

This is a small, simple HTML app that accepts your resume in JSON and produces an HTML page that is ready to print to PDF.

## To run this on a Mac locally

Spin up a temporary web server and browse to the URL:

1. In Terminal, navigate to the directory you put the files in (ex. "resume")
```bash
   cd documents/json-resume
```

2. Start a web server from Python
```bash
   python3 -m http.server 8002
```
   (or whatever port you choose)

3. Then from browser, navigate to `http://localhost:8002`

   (or whatever port you chose)

4. Stop the web server with `Control-C`
