import * as markedjs from "./3rdparty/marked.esm.js";

async function fetchBlogs() {
    const blogDir = "./blogs";
    const supportedFormats = [".md"]; //cannot support .org now
    
    let blogs = [];

    let i = 1;
    while(true){
	let has = false;
	for(const suffix of supportedFormats){
	    const url = blogDir + "/" + i.toString() + suffix;
	    const response = await fetch(url);
	    if(response.ok){
		blogs.push({
		    'url': url,
		    'content': await response.text()
		});
		has = true;
	    }
	}
	if(!has){
	    break;
	}
	i += 1;
    }

    const blogListElem = document.getElementById("blog-list");
    for(const blog of blogs){
	const liElem = document.createElement("li");
	liElem.addEventListener("click", function(e){
	    switchToBlog(blog.content);
	});
	liElem.append(blog.content.substring(0, 10));
	blogListElem.append(liElem);
    }

    if(blogs.length == 0){
	const liElem = document.createElement("li");
	liElem.append("empty");
	blogListElem.append(liElem);
    }

    return true;
}

function switchToBlog(blogContent){
    document.body.innerHTML = markedjs.marked.parse(blogContent);
}

fetchBlogs().then(ret => {
    if(ret){
	console.log("fetched all blogs");
    }
});

