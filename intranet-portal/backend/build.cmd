@echo off
dotnet build "%~dp0IntranetPortal.sln" -m:1 -p:RestoreDisableParallel=true
