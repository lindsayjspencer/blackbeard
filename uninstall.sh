#!/bin/bash

echo "// Uninstalling transmission"
sudo /etc/init.d/transmission-daemon stop
echo "> Daemon service stopped."
echo ""
sudo apt-get -qq purge transmission-daemon -y
echo "> Transmission daemon uninstalled successfully."
sudo apt-get -qq purge transmission-remote-cli -y
echo "> Transmission remote cli uninstalled successfully."

echo "// Clearing Blackbeard"
sudo rm -r torrents/*
echo "> torrents/* cleared"
sudo rm -r downloads/*
echo "> downloads/* cleared"
sudo rm -r data/*
echo "> data/* cleared"
echo ""
echo "// Disabling service"
sudo systemctl stop blackbeard-monitor.service
sudo systemctl disable blackbeard-monitor.service
sudo systemctl daemon-reload
echo "> Service disabled."
sudo rm /etc/systemd/system/blackbeard-monitor.service
echo "> And removed."
echo ""
echo "Ready to install."
