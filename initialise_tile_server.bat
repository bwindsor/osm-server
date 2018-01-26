REM Create new containers, make sure they are build to the latest version, and detach from them
docker-compose up --build -d
REM Wait to make sure containers are properly up and running
sleep 15s
REM Restart containers
docker-compose restart