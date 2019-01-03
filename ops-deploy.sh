docker login -u _json_key -p "$(cat config-gcp.json)" https://eu.gcr.io;

echo "1 creating network";
docker network create container-router;

echo "2 running api-core";
docker pull eu.gcr.io/thegmc-219013/oscar-production-api-core:latest;
docker stop oscar-production-api-core;
docker rm oscar-production-api-core;
docker run --name oscar-production-api-core --net container-router -p 1025:1025 -d eu.gcr.io/thegmc-219013/oscar-production-api-core;

echo "3 running api-bin";
docker pull eu.gcr.io/thegmc-219013/oscar-production-api-bin:latest;
docker stop oscar-production-api-bin;
docker rm oscar-production-api-bin;
docker run --name oscar-production-api-bin --net container-router -p 1026:1026 -d eu.gcr.io/thegmc-219013/oscar-production-api-bin;

echo "4 running app-oscar";
docker pull eu.gcr.io/thegmc-219013/oscar-production-app-oscar:latest;
docker stop oscar-production-app-oscar;
docker rm oscar-production-app-oscar;
docker run --name oscar-production-app-oscar --net container-router -p 1027:1027 -d eu.gcr.io/thegmc-219013/oscar-production-app-oscar;

echo "5 running app-store";
docker pull eu.gcr.io/thegmc-219013/oscar-production-app-store:latest;
docker stop oscar-production-app-store;
docker rm oscar-production-app-store;
docker run --name oscar-production-app-store --net container-router -p 1028:1028 -d eu.gcr.io/thegmc-219013/oscar-production-app-store;

echo "5 running app-play";
docker pull eu.gcr.io/thegmc-219013/oscar-production-app-play:latest;
docker stop oscar-production-app-play;
docker rm oscar-production-app-play;
docker run --name oscar-production-app-play --net container-router -p 1029:1029 -d eu.gcr.io/thegmc-219013/oscar-production-app-play;

echo "5 running site";
docker pull eu.gcr.io/thegmc-219013/oscar-production-site:latest;
docker stop oscar-production-site;
docker rm oscar-production-site;
docker run --name oscar-production-site --net container-router -p 1030:1030 -d eu.gcr.io/thegmc-219013/oscar-production-site;

echo "5 running service-mail";
docker pull eu.gcr.io/thegmc-219013/oscar-production-service-mail:latest;
docker stop oscar-production-service-mail;
docker rm oscar-production-service-mail;
docker run --name oscar-production-service-mail --net container-router -p 1031:1031 -d eu.gcr.io/thegmc-219013/oscar-production-service-mail;

echo "6 running container-router";
docker pull eu.gcr.io/thegmc-219013/oscar-production-container-router:latest;
docker stop oscar-production-container-router;
docker rm oscar-production-container-router;
docker run --name oscar-production-container-router --net container-router -p 1024:1024 -d eu.gcr.io/thegmc-219013/oscar-production-container-router;
