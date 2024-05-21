This repository is a boilerplate to create a secure (I hope) backend services using express.

It implements several API Securities as follows :

1. Rate Limiting (express-rate-limit)
   Rate limiting is to limit requests that can be made from the same IP

2. Speed Limiting (express-slow-down)
   This will delay the response time of an endpoint after the user has reached "delayAfter" request with "delayMs" time

3. Allow List / White List

4. API Keys implementation

5. Leveled API Keys
