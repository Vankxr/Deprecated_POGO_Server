@echo off
echo NPM Package installer. Please provide the package name and press 'Enter'

set /p pn=Package name: 
npm install %pn%
echo Sucessfully installed, you can now close this window!
pause