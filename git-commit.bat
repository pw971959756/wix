git config --global user.email "zjin053@uottawa.ca"
git config --global user.name "zjin053@uottawa.ca"
git add .\data\
git commit -m  "%date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%"
git push -u origin master
