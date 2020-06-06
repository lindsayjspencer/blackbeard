#!/bin/bash

cd ../
echo "// Uninstalling transmission"
sudo /etc/init.d/transmission-daemon stop
echo "> Daemon service stopped."
echo ""
sudo apt-get -qq purge transmission-daemon -y
echo "> Transmission daemon uninstalled successfully."
sudo apt-get -qq purge transmission-remote-cli -y
echo "> Transmission remote cli uninstalled successfully."

echo "// Clearing Blackbeard"
sudo rm -r blackbeard/torrents/*
echo "> blackbeard/torrents/* cleared"
sudo rm -r blackbeard/downloads/*
echo "> blackbeard/downloads/* cleared"
sudo rm -r blackbeard/data/*
echo "> blackbeard/data/* cleared"
echo ""
echo "// Disabling service"
sudo systemctl stop blackbeard-monitor.service
sudo systemctl stop blackbeard-web.service
sudo systemctl disable blackbeard-monitor.service
sudo systemctl disable blackbeard-web.service
sudo systemctl daemon-reload
echo "> Service disabled."
sudo rm /etc/systemd/system/blackbeard-monitor.service
sudo rm /etc/systemd/system/blackbeard-web.service
echo "> And removed."
echo ""
echo "Ready to install."
