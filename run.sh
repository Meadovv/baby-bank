echo "What mode yout want to run?"
echo "client(1) - server(2) - dev(3)"

client=1
server=2

read option

if [ $option -eq $client ]
then
    cd client
    npm start
else
    if [ $option -eq $server ]
    then
        cd server
        npm run server
    else
        cd server
        npm run dev
    fi
fi