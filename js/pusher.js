let APP_KEY = "1f0c828eca2f60f054e4"
var pusher = new Pusher(APP_KEY,{cluster:"eu"})

var channel = pusher.subscribe("user.8");

channel.bind( "poker" , p => log = p )

const GET = "GET"
const POST = "POST"
const SERVER = "https://api.lastline.fiterik.com"

var token

let xhr = new XMLHttpRequest();
xhr.open(GET, SERVER+"/auth/register", true ); 
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.onreadystatechange = function()
{
	if (this.readyState == 4 && this.status == 200)
	{
		log = this.responseText;
		log = this.data
	}
}
xhr.send()