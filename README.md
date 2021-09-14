# Element Position Scanner (EPS)

Fully functional demo presentation is available at https://eps-app.com  
(with already preloaded test account at login)

EPS (Element Position Scanner) is a tool for businesses to efficiently monitor positions (rankings) of their products (and their competitors) on other websites.

Example use case scenarios:

- Sales team is managing several partnerships (resellers, distributors etc.). Part of the partnership deal is specification on what position (ranking) on the partners web page will be the company's product/service listed. To check manually 100+ partner web pages is highly inefficient and possibly error prone. With usage of EPS the sales team can retrieve this data easily and in addition get data about position of product/services of their competitors.
- Marketing / brand ambassador team of a major smartphone brand which is in charge of brand awareness. They need to monitor positions (rankings) of their smartphone brands as well their competitors on the major e-commerce websites.

User provides Targets - list of urls (web pages) and selectors (CSS) targeting the relevant items on those web pages. EPS then opens these web pages one by one in a virtual web browser, scans the positions (rankings) and saves them to the database. Then the user (data analyst, marketer, sales person etc.) can view them or download them for further analysis from Rankings.

Scannings of rankings can be set up according to the business needs (for example once per week, once per day or several times per day).

Selector can be generated via Find Selector tool, which helps users without technical knowledge of HTML/CSS to find relevant Selector. User enters the url (target web page) and list of relevant items (text from the web page). Then EPS visits the web page, evaluates all possible options and returns the most statistically relevant selector, which can be then verified via Verify Selector and saved to the database (Targets).

For illustration purposes data about smartphone popularity (rankings) are already preloaded from the major e-commerce web pages (targets). Targets Table has unlocked all features (add/edit/delete/export) and reset to default values.

# EPS API (backend)

EPS API is a REST API - backend Express server written in Node.js (JavaScript) using MongoDB database. User authentication is handled by JWT (JSON Web Token) and passwords are encrypted by Bcrypt. Data retrieval from other websites is done via Puppeteer (by controlling a virtual Chromium web browser). Testing is done by the Jest testing framework.

Features

- User registration, login
- Protected API endpoints (requiring JWT authentication)
- Full CRUD functionality (create, read, update, and delete)
- Data import from Google Sheets
- Verification of results from data retrieval
- Promise Pool with concurrency options for running data retrieval from websites in parallel
- CLI (Command-line interface) for running it locally
- Data retrieval from other websites can be set up according to the business needs (for example once per week, once per day or several times per day).

# EPS APP (frontend)

EPS APP is a frontend React SPA (Single-page application) which retrieves data from EPS API via Axios calls. Users can view data in a table with search, sort, pagination, add/edit/delete functions and download in CSV or PDF format. Jest testing framework is used for testing.

Fully functional demo presentation is available at https://eps-app.com  
(with already preloaded test account at login)

EPS APP1 - TypeScript implementation with simple visuals

- Code: https://github.com/francis-hrom/eps-app1
- Online demo: https://eps-app1.surge.sh

EPS APP2 - JavaScript implementation with template visuals

- Code: https://github.com/francis-hrom/eps-app2
- Online demo: https://eps-app2.surge.sh

Features list

- User login
- Bootstrap and Material UI visual elements
- Responsive layout
- Tables with search, sort, pagination, add/edit/delete, download CSV/PDF functions
- Remotely accessing a virtual web browser via API calls
