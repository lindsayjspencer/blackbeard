#!/bin/bash

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
npm i --silent
echo "> Installed."
mkdir -p torrents
chmod 777 torrents
mkdir -p downloads
chmod 777 downloads
mkdir -p data
chmod 777 data
echo ""
echo "// Creating persistent torrent monitor"
sudo cp lib/bb-json.db.service /etc/systemd/system/bb-json.db.service
echo "> Created."
echo ""
echo "// Creating persistent web server"
sudo cp lib/bb-web.service /etc/systemd/system/bb-web.service
echo "> Created."
echo ""
echo "// Modify to allow execution"
sudo chmod +x web.js
sudo chmod +x json.db/server.js
echo "> Created."
echo ""
echo "// Enabling service"
sudo systemctl daemon-reload
sudo systemctl enable blackbeard-monitor.service
sudo systemctl enable blackbeard-web.service
sudo systemctl start blackbeard-monitor.service
sudo systemctl start blackbeard-web.service
echo "> Service started."
echo ""
