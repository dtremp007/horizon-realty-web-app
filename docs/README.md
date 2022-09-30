# Progress so far...
## The data pipeline
1. When a client makes a request to "/listings", the server fetches all the data from Firebase, builds the page from scratch, and send the data along with the HTML in JSON format.
2. It also fetches all the filters from a local JSON file, and includes it with the payload.