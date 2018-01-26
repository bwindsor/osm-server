@echo off
setlocal EnableDelayedExpansion

REM Remove the containers and network
call docker-compose down

REM Remove database volume
FOR /F "tokens=* USEBACKQ" %%i IN (`docker volume ls -q`) DO (
    echo %%i | grep osm_postgres_database
    IF "!ERRORLEVEL!"=="0" (
        SET VOL_NAME=%%i
        docker volume rm !VOL_NAME!
        GOTO BREAK
    )
)
:BREAK