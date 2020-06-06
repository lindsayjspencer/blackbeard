#!/bin/bash

cd ../
echo "// Installing transmission"
sudo apt-get -qq install transmission-daemon -y
echo "> Transmission daemon installed successfully."
sudo apt-get -qq install transmission-remote-cli -y
echo "> Transmission remote cli installed successfully."
sudo /etc/init.d/transmission-daemon stop
echo "> Daemon service stopped."
echo ""
echo "// Insert transmission settings file"
sudo cp lib/transmission.settings.json /etc/transmission-daemon/settings.json
echo "> Saved."
sudo /etc/init.d/transmission-daemon start
echo "> Daemon service restarted."
echo ""

echo "// Installing Blackbeard"
# npm i --silent
echo "> Installed."
# mkdir -p blackbeard/downloads
# chmod 777 blackbeard/downloads
# mkdir -p blackbeard/data
# chmod 777 blackbeard/data
# mkdir -p blackbeard/incomplete
# chmod 777 blackbeard/incomplete
echo ""
echo "// Creating persistent web server"
sudo cp lib/blackbeard.service /etc/systemd/system/blackbeard.service
echo "> Created."
echo ""
echo "// Modify to allow execution"
sudo chmod +x index.js
echo "> Created."
echo ""
echo "// Enabling service"
sudo systemctl daemon-reload
sudo systemctl enable blackbeard.service
sudo systemctl start blackbeard.service
echo "> Service started."
echo ""
