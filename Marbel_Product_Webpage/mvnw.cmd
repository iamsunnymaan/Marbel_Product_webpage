@echo off
setlocal

set MAVEN_VERSION=3.9.6
set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\apache-maven-%MAVEN_VERSION%
set MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd

if not exist "%MAVEN_CMD%" (
    echo [INFO] Maven %MAVEN_VERSION% not found. Downloading...
    set MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip
    set MAVEN_ZIP=%TEMP%\apache-maven-%MAVEN_VERSION%-bin.zip
    
    powershell -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%TEMP%\apache-maven-%MAVEN_VERSION%-bin.zip'"
    
    if not exist "%USERPROFILE%\.m2\wrapper" mkdir "%USERPROFILE%\.m2\wrapper"
    
    powershell -Command "Expand-Archive -Path '%TEMP%\apache-maven-%MAVEN_VERSION%-bin.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper' -Force"
    
    echo [INFO] Maven downloaded successfully.
)

echo [INFO] Using Maven from: %MAVEN_HOME%
call "%MAVEN_CMD%" %*
