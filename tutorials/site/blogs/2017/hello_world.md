Hello World! This is the first entry of Kevin's Blog. Woohoo! There have been several others, but this one is here to stay (for now).

So here's a quick into into a few things:

### Me

I'm a 31 year old computer programmer living in Florida. I've got a wife and a baby and on those newly rare occasions when I'm not working I like to play with amateur radio.

The past decade of my life has been an interesting one and if you'd asked me when I was 21 where I'd be at 31, there's a good chance I could not have guessed here. That scares me a bit because I really like here and I want the here in another decade to be a similar here, but there's really just no way of ensuring that's going to happen.

I like words and silliness. In JavaScript the `this` variable can refer to a different thing depending on where it's at in the code. Like the here from above was referring to different parts of my life, but if I type here here it is referring to this paragraph of text. Life's all about points of view and realizing that your you is just like everyone else's but completely different. What's right for you is really just for you and has little baring on what's right for another you.

Please refer to The Beatles for more on this topic.

### This Site

Back to something more concrete, let's talk about this site. It's built with a couple of cool webdev toys of 2017, <a href="http://gulpjs.com/" target="_blank" rel="noopener">gulp</a> and <a href="https://twig.sensiolabs.org/" target="_blank" rel="noopener">twig</a>. There are two competing goals (among all of the other ones) in web development and those are speed and the ability to be dynamic. For example, a site's content should be ready in less than a second and the layout should be the same for all pages while hopefully not having to be manually repeated on each page.

A site built with PHP could accomplish the second goal easily, just make a template file and have it load in content from the database depending on the url that was requested. That's also nice because the database can be one central location for all of the content and anything else that's going to be done on the site like comments or analytics.

The downside to using a server-side script to generate the site is that it has to run on each page load and that takes cpu cycles and memory. I mean, in reality it's a very small amount of resources, especially for a simple blog, but it's still more than nothing and when considering scaling (in that magical world where a site's loading 10k times a minute) it's a real bottleneck.

To get speedy quick a site can be all static files, just some text that never changes and gets sent right away when the user requests it, no processing needed. I think text files are ideal, especially when formatted in a way to work well with browsers since we all want to get a 100 on the <a href="https://developers.google.com/speed/pagespeed/insights/" target="_blank" rel="noopener">Google page speed test</a>, even though that's a challenge that'll make you go crazy (looking at you `analytics.js`).

The challenge with text files is that they're so static and would require the same content to be in each one with the header and footer and other resources. Plus, to change anything simple, like the site title, each file would have to be updated.

Well, there's of course some middle ground (always find the extremes and then look in between) and that's where I landed. One option is using php and setting up some caching to store all of the dynamic content statically every so often, but I do not like caching because it confuses me and is a pita to clear and keep track of and configure.

The middle ground I like is using twig with gulp. With twig I can have a template file for the common code between pages, so there's the dynamic content, and with gulp I can do all of the other magic like converting sassy styling to css, minimizing, and reading a json file of blog titles into an object to be used by twig. This way absolutely everything can remain in the repo and only requires some npm dependencies to get up and running.


## Okay

So that's an intro into me and this site. If things go according to plan (ha), this will just be the beginning.
