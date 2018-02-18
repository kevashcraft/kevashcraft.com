#!/bin/bash

gulp

docker build -t kevashcraft/kevashcraft-com-www -f build/Dockerfile-www .
docker push kevashcraft/kevashcraft-com-www

docker build -t kevashcraft/kevashcraft-com-blog -f build/Dockerfile-blog .
docker push kevashcraft/kevashcraft-com-blog

docker build -t kevashcraft/kevashcraft-com-tutorials -f build/Dockerfile-tutorials .
docker push kevashcraft/kevashcraft-com-tutorials

