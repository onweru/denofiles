// read json file
const fileToRead = "./file.json"
const decoder = new TextDecoder("utf-8");
const rawPosts = await Deno.readFile(fileToRead);
let myPosts = decoder.decode(rawPosts); 

// parse the json object and loop through it
JSON.parse(myPosts).forEach(function(post: any, index: Number){
  const date = post.published;
  const postSlug = date && date != "NULL"  ? date.substring(0,10) : "2014-07-04";
  const permalink = post.permalink ? post.permalink : `${index}`;
  let modified = post.modified;
  modified = modified && modified != "NULL" ? modified : "2020-07-05";
  const title = post.title && post.title.trim().length > 1 && post.title != "NULL" ? post.title : `new-post-${permalink}`;
  const description = post.description ?  post.description.trim(): "#";
  const image = post.image;
  const body = post.body;

  // ugly search and replace
  // to be simplified
  const postFilename = `${postSlug}-${title
  .replace(new RegExp(' ', 'g'),"-")
  .replace(new RegExp(':', 'g'),"")
  .replace(new RegExp('\"', 'g'),"-")
  .replace(new RegExp('\/', 'g'),"-")
  .replace(new RegExp('&', 'g'),"-")
  .replace(new RegExp("<br>", 'g'),"")
  .replace(new RegExp(',', 'g'),"-")
  .replace(new RegExp('\'', 'g'),"-")
  .replace(new RegExp(':', 'g'),"-")
  .replace(new RegExp('--', 'g'),"-")
  .toLowerCase()}.md`;

// compose final file string
const newPost = `---
title: "${title}"
date: "${date}"
image: "${image}"
last_modified: "${modified}"
description: |
  "${description}"
---

${body}
`;

  // create file and write the formatted string to the file
  Deno.writeTextFileSync(`${postFilename}`, newPost);  

});
