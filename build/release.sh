#!/bin/bash
#
# kevashcraft.com's release script
# builds a container tagged with the latest version,
# and pushes it to docker hub before updating the k8s deployment
#
# variables:
#   site        [www,tutorials,blog], default=all
#

gulp --gulpfile build/gulp/Gulpfile.js

if [ -z $site ]; then
  site=all
fi

version=`git describe --abbrev=0`

if [ "$site" = "all" ] || [ "$site" == "www" ]; then
  docker build -t kevashcraft/kevashcraft-com-www:$version -t kevashcraft/kevashcraft-com-www:latest -f build/docker/Dockerfile-www .
  docker push kevashcraft/kevashcraft-com-www:$version
  docker push kevashcraft/kevashcraft-com-www:latest
  kubectl set image deployment/kevashcraft-com-www kevashcraft-com-www=kevashcraft/kevashcraft-com-www:$version
fi

if [ "$site" = "all" ] || [ "$site" == "blog" ]; then
  docker build -t kevashcraft/kevashcraft-com-blog:$version -t kevashcraft/kevashcraft-com-blog:latest -f build/docker/Dockerfile-blog .
  docker push kevashcraft/kevashcraft-com-blog:$version
  docker push kevashcraft/kevashcraft-com-blog:latest
  kubectl set image deployment/kevashcraft-com-blog kevashcraft-com-blog=kevashcraft/kevashcraft-com-blog:$version
fi
  
if [ "$site" = "all" ] || [ "$site" == "tutorials" ]; then
  docker build -t kevashcraft/kevashcraft-com-tutorials:$version -t kevashcraft/kevashcraft-com-tutorials:latest -f build/docker/Dockerfile-tutorials .
  docker push kevashcraft/kevashcraft-com-tutorials:$version
  docker push kevashcraft/kevashcraft-com-tutorials:latest
  kubectl set image deployment/kevashcraft-com-tutorials kevashcraft-com-tutorials=kevashcraft/kevashcraft-com-tutorials:$version
fi

