require("../styles/style.css");
var writer = require("./writer.js");

let app = document.getElementById('app');
app.insertAdjacentHTML("beforeend","<button>Fetch </button>")
writer.writeNewsletter()