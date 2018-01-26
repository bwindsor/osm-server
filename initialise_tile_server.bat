REM Create new containers, making sure we build, and detach from them
docker-compose up --build -d
REM Wait to make sure containers are properly up and running
sleep 20s
REM Restart containers
docker-compose restart